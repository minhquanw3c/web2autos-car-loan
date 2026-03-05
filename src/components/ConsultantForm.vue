<script setup lang="ts">
	import { ref, reactive, watch } from 'vue'
	import { useLoanStore } from '@/stores/loan'
	import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
	import type { FormSchema, FormInput } from '@/types'
	import { BACKEND_API_URL } from '@/constants/utils'

	const store = useLoanStore()
	const summaryVisible = ref(false)
	const isDev = import.meta.env.DEV // Check for Dev environment

	// Helper for currency formatting
	const formatCurrency = (val: number) => {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)
	}

	// 1. Schema
	const schema = reactive<FormSchema>({
		formHeading: 'Finance application',
		formDescription:
			'Please complete the details below securely. A dedicated consultant will review your information and contact you shortly.',
		groups: [
			{
				heading: 'Personal Information',
				inputs: [
					{ label: 'First Name', type: 'text', required: true },
					{ label: 'Last Name', type: 'text', required: true },
					{ label: 'SSN', type: 'password', required: true },
					{
						label: 'Date of birth',
						type: 'text',
						required: true,
						format: 'mm/dd/yyyy',
						components: {
							mm: { type: 'select', options: '1..12' },
							dd: { type: 'select', options: '1..31' },
							yy: { type: 'select', options: '1920..2025' }
						}
					},
					{ label: 'Phone', type: 'text', required: true, format: '(XXX) XXX-XXXX', masked: true },
					{ label: 'Email', type: 'email', required: true }
				]
			},
			{
				heading: 'Residence',
				inputs: [
					{ label: 'Address Line 1', type: 'text', required: true },
					{ label: 'Address Line 2', type: 'text', required: false },
					{ label: 'City', type: 'select', required: true, options: 'US cities' },
					{ label: 'State', type: 'select', required: true, options: 'US states' },
					{ label: 'Zip Code', type: 'text', required: true },
					{
						label: 'Housing Status',
						type: 'select',
						required: true,
						options: ['Rent', 'Own', 'Live with relative']
					},
					{ label: 'Monthly Payment (Your portion)', type: 'number', required: false },
					{
						label: 'Time at current address',
						type: 'text',
						required: true,
						format: '() years, () months',
						components: { year: { type: 'number' }, month: { type: 'number' } }
					}
				]
			},
			{
				heading: 'Previous Residence',
				inputs: [
					{ label: 'Address Line 1', type: 'text', required: true },
					{ label: 'Address Line 2', type: 'text', required: false },
					{ label: 'City', type: 'select', required: true, options: 'US cities' },
					{ label: 'State', type: 'select', required: true, options: 'US states' },
					{ label: 'Zip Code', type: 'text', required: true },
					{
						label: 'Time at previous address',
						type: 'text',
						required: true,
						format: '() years, () months',
						components: { year: { type: 'number' }, month: { type: 'number' } }
					}
				]
			},
			{
				heading: 'Employment',
				inputs: [
					{
						label: 'Employment Status',
						type: 'select',
						required: true,
						options: ['Employed', 'Retired', 'Self-employed', 'Other']
					},
					{ label: 'Company Name', type: 'text', required: true }
				]
			},
			{
				heading: 'Work Address',
				inputs: [
					{ label: 'Address Line 1', type: 'text', required: true },
					{ label: 'Address Line 2', type: 'text', required: false },
					{ label: 'City', type: 'select', required: true, options: 'US cities' },
					{ label: 'State', type: 'select', required: true, options: 'US states' },
					{ label: 'Zip Code', type: 'text', required: true },
					{ label: 'Occupation/Job Title', type: 'text', required: true },
					{ label: 'Work Phone', type: 'text', required: false },
					{
						label: 'Time of Current Employment',
						type: 'text',
						required: true,
						format: '() years, () months',
						components: { year: { type: 'number' }, month: { type: 'number' } }
					},
					{ label: 'Total Monthly Income', type: 'number', required: true }
				]
			},
			{
				heading: 'Previous Work Address',
				inputs: [
					{ label: 'Company Name', type: 'text', required: true },
					{ label: 'Address Line 1', type: 'text', required: true },
					{ label: 'Address Line 2', type: 'text', required: false },
					{ label: 'City', type: 'select', required: true, options: 'US cities' },
					{ label: 'State', type: 'select', required: true, options: 'US states' },
					{ label: 'Zip Code', type: 'text', required: true },
					{ label: 'Occupation/Job Title', type: 'text', required: true },
					{
						label: 'Time at previous employment',
						type: 'text',
						required: true,
						format: '() years, () months',
						components: { year: { type: 'number' }, month: { type: 'number' } }
					}
				]
			},
			{
				heading: 'Final details',
				inputs: [
					{ label: 'Allow partner dealerships to access my credit report', type: 'checkbox', default: false },
					{ label: 'Estimated Credit Score', type: 'number', required: true },
					{ label: 'Planned Down Payment', type: 'number', required: true },
					{
						label: 'I authorize the dealership to run my credit report.',
						type: 'checkbox',
						default: false,
						required: true
					},
					{
						label: 'I agree to the Privacy Policy.',
						type: 'checkbox',
						default: false,
						required: true
					},
					{
						label: 'I agree to receive marketing emails.',
						type: 'checkbox',
						default: false,
						required: false
					},
					{ label: 'Digital Signature', type: 'signature', required: true }
				]
			}
		]
	})

	// 2. State
	const formData = reactive<Record<string, any>>({})
	const errors = reactive<Record<string, string>>({})
	const itemRefs = reactive<Record<string, any>>({})
	const signatureRefs = ref<Record<string, HTMLCanvasElement>>({})
	const isDrawing = ref(false)
	const lastPos = reactive({ x: 0, y: 0 })

	const setSignatureRef = (el: any, key: string) => {
		if (el) signatureRefs.value[key] = el
	}

	const getPos = (canvas: HTMLCanvasElement, e: MouseEvent | TouchEvent) => {
		const rect = canvas.getBoundingClientRect()
		let clientX = 0
		let clientY = 0
		if (window.TouchEvent && e instanceof TouchEvent) {
			if (e.touches.length > 0 && e.touches[0]) {
				clientX = e.touches[0].clientX
				clientY = e.touches[0].clientY
			}
		} else {
			clientX = (e as MouseEvent).clientX
			clientY = (e as MouseEvent).clientY
		}
		return {
			x: (clientX - rect.left) * (canvas.width / rect.width),
			y: (clientY - rect.top) * (canvas.height / rect.height)
		}
	}

	const startDrawing = (e: MouseEvent | TouchEvent, key: string) => {
		isDrawing.value = true
		const canvas = signatureRefs.value[key]
		if (!canvas) return
		const pos = getPos(canvas, e)
		lastPos.x = pos.x
		lastPos.y = pos.y
	}

	const draw = (e: MouseEvent | TouchEvent, key: string) => {
		if (!isDrawing.value) return
		const canvas = signatureRefs.value[key]
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const pos = getPos(canvas, e)
		ctx.lineWidth = 2
		ctx.lineCap = 'round'
		ctx.strokeStyle = '#000'

		ctx.beginPath()
		ctx.moveTo(lastPos.x, lastPos.y)
		ctx.lineTo(pos.x, pos.y)
		ctx.stroke()

		lastPos.x = pos.x
		lastPos.y = pos.y
	}

	const stopDrawing = (key: string) => {
		if (isDrawing.value) {
			isDrawing.value = false
			saveSignature(key)
		}
	}

	const saveSignature = (key: string) => {
		const canvas = signatureRefs.value[key]
		if (canvas) {
			formData[key] = canvas.toDataURL('image/png', 1.0)
			if (errors[key]) delete errors[key]
		}
	}

	const clearSignature = (key: string) => {
		const canvas = signatureRefs.value[key]
		if (canvas) {
			const ctx = canvas.getContext('2d')
			ctx?.clearRect(0, 0, canvas.width, canvas.height)
			formData[key] = ''
		}
	}

	const usStates = [
		'AL',
		'AK',
		'AZ',
		'AR',
		'CA',
		'CO',
		'CT',
		'DE',
		'FL',
		'GA',
		'HI',
		'ID',
		'IL',
		'IN',
		'IA',
		'KS',
		'KY',
		'LA',
		'ME',
		'MD',
		'MA',
		'MI',
		'MN',
		'MS',
		'MO',
		'MT',
		'NE',
		'NV',
		'NH',
		'NJ',
		'NM',
		'NY',
		'NC',
		'ND',
		'OH',
		'OK',
		'OR',
		'PA',
		'RI',
		'SC',
		'SD',
		'TN',
		'TX',
		'UT',
		'VT',
		'VA',
		'WA',
		'WV',
		'WI',
		'WY'
	]
	const mockCities = [
		'New York',
		'Los Angeles',
		'Chicago',
		'Houston',
		'Phoenix',
		'Philadelphia',
		'San Antonio',
		'San Diego',
		'Dallas',
		'San Jose'
	]

	const mockVehicle = {
		heading: 'Pre-approval form.',
		price: 0,
		stock_no: 'Pre-approval form.',
		dealer: {
			name: 'Pre-approval form.',
			street: 'Pre-approval form.'
		},
		referenceUrl: 'Pre-approval form.',
		year: 0,
		make: 'Pre-approval form.',
		model: 'Pre-approval form.'
	}

	const generateKey = (groupHeading: string, label: string) => {
		const prefix = groupHeading.replace(/\s+/g, '').toLowerCase()
		const suffix = label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
		return `${prefix}_${suffix}`
	}

	const setItemRef = (el: any, key: string) => {
		if (el) itemRefs[key] = el
	}

	const shouldShowGroup = (group: any) => {
		if (group.heading === 'Previous Residence') {
			const timeKey = 'residence_timeatcurrentaddress'
			const timeData = formData[timeKey]
			const year = timeData && timeData.year !== '' ? Number(timeData.year) : 0
			return year < 1
		}
		const status = formData['employment_employmentstatus']
		const isEmployed = status === 'Employed' || status === 'Self-employed'

		if (group.heading === 'Work Address') {
			return isEmployed
		}
		if (group.heading === 'Previous Work Address') {
			if (!isEmployed) return false
			const timeKey = 'workaddress_timeofcurrentemployment'
			const timeData = formData[timeKey]
			const year = timeData && timeData.year !== '' ? Number(timeData.year) : 0
			return year < 1
		}
		return true
	}

	const shouldShowInput = (group: any, input: any) => {
		if (group.heading === 'Employment' && input.label === 'Company Name') {
			const status = formData['employment_employmentstatus']
			return status === 'Employed' || status === 'Self-employed'
		}
		return true
	}

	// Init Data
	schema.groups.forEach((group) => {
		group.inputs.forEach((input) => {
			const key = generateKey(group.heading, input.label)
			if (input.components) {
				formData[key] = {}
				Object.keys(input.components).forEach((compKey) => {
					formData[key][compKey] = ''
				})
			} else {
				let val: any = ''
				if (input.type === 'checkbox') val = false
				// Always populate Down Payment from store if available
				if (input.label.includes('Down Payment')) {
					val = store.downPayment
				}
				formData[key] = val
			}
			if (input.type === 'signature') formData[key] = ''
		})
	})

	// Watch Employment Status to toggle Company Name requirement
	watch(
		() => formData['employment_employmentstatus'],
		(newVal) => {
			const isEmployed = newVal === 'Employed' || newVal === 'Self-employed'
			const empGroup = schema.groups.find((g) => g.heading === 'Employment')
			const compInput = empGroup?.inputs.find((i) => i.label === 'Company Name')
			if (compInput) {
				compInput.required = isEmployed
			}
		},
		{ immediate: true }
	)

	const resolveOptions = (optionsStr: string | string[] | undefined) => {
		if (!optionsStr) return []
		if (Array.isArray(optionsStr)) return optionsStr
		if (optionsStr === 'US states') return usStates
		if (optionsStr === 'US cities') return mockCities
		if (optionsStr && optionsStr.includes('..')) {
			const [start, end] = optionsStr.split('..').map(Number)
			const arr = []
			if (start && end) {
				for (let i = start; i <= end; i++) arr.push(i.toString())
			}
			return arr
		}
		return []
	}

	const getResponsiveProps = (input: FormInput) => {
		const l = input.label.toLowerCase()
		if (input.type === 'checkbox') return { span: 24 }
		if (input.type === 'signature') return { span: 24 }
		if (l === 'current address' || l === 'address') return { xs: 24, sm: 24, md: 24, lg: 24 }
		return { xs: 24, sm: 12, md: 12, lg: 8 }
	}

	const checkErrors = () => {
		Object.keys(errors).forEach((key) => delete errors[key])
		let firstErrorKey: string | null = null

		schema.groups.forEach((group) => {
			if (!shouldShowGroup(group)) return
			group.inputs.forEach((input) => {
				if (!shouldShowInput(group, input)) return
				const key = generateKey(group.heading, input.label)
				let errorMsg: string | null = null

				if (input.required) {
					if (input.components) {
						const parts = formData[key]
						if (Object.values(parts).some((val) => !val && val !== 0))
							errorMsg = `Please complete the ${input.label.toLowerCase()}.`
					} else {
						const val = formData[key]
						if (!val && val !== 0)
							if (input.type === 'checkbox') errorMsg = 'This field is required.'
							else if (input.type === 'signature') errorMsg = 'Please sign the application.'
							else errorMsg = `${input.label} is required.`
					}
				}
				if (!errorMsg && input.type === 'email' && formData[key]) {
					if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[key]))
						errorMsg = 'Please enter a valid email address.'
				}
				if (errorMsg) {
					errors[key] = errorMsg
					if (!firstErrorKey) firstErrorKey = key
				}
			})
		})
		return firstErrorKey
	}

	const testDataSets = [
		{
			name: 'Employed (Stable)',
			data: {
				personalinformation_firstname: 'John',
				personalinformation_lastname: 'Doe',
				personalinformation_ssn: '123456789',
				personalinformation_dateofbirth: { mm: '5', dd: '15', yy: '1985' },
				personalinformation_phone: '(555) 123-4567',
				personalinformation_email: 'john.doe@example.com',
				residence_addressline1: '123 Maple Ave',
				residence_city: 'Springfield',
				residence_state: 'IL',
				residence_zipcode: '62704',
				residence_housingstatus: 'Own',
				residence_monthlypaymentyourportion: 1200,
				residence_timeatcurrentaddress: { year: 5, month: 0 },
				employment_employmentstatus: 'Employed',
				employment_companyname: 'Acme Corp',
				workaddress_addressline1: '456 Tech Blvd',
				workaddress_city: 'Springfield',
				workaddress_state: 'IL',
				workaddress_zipcode: '62704',
				workaddress_occupationjobtitle: 'Manager',
				workaddress_timeofcurrentemployment: { year: 4, month: 2 },
				workaddress_totalmonthlyincomeorannually: 6000,
				finaldetails_planneddownpayment: 2000,
				finaldetails_estimatedcreditscore: 750
			}
		},
		{
			name: 'Self-Employed (Moving)',
			data: {
				personalinformation_firstname: 'Jane',
				personalinformation_lastname: 'Smith',
				personalinformation_ssn: '987654321',
				personalinformation_dateofbirth: { mm: '8', dd: '22', yy: '1992' },
				personalinformation_phone: '(555) 987-6543',
				personalinformation_email: 'jane.smith@example.com',
				residence_addressline1: '789 Oak St',
				residence_city: 'Chicago',
				residence_state: 'IL',
				residence_zipcode: '60601',
				residence_housingstatus: 'Rent',
				residence_monthlypaymentyourportion: 1800,
				residence_timeatcurrentaddress: { year: 0, month: 6 },
				previousresidence_addressline1: '321 Pine Ln',
				previousresidence_city: 'Evanston',
				previousresidence_state: 'IL',
				previousresidence_zipcode: '60201',
				previousresidence_timeatpreviousaddress: { year: 2, month: 0 },
				employment_employmentstatus: 'Self-employed',
				employment_companyname: 'Smith Designs',
				workaddress_addressline1: '789 Oak St',
				workaddress_city: 'Chicago',
				workaddress_state: 'IL',
				workaddress_zipcode: '60601',
				workaddress_occupationjobtitle: 'Designer',
				workaddress_timeofcurrentemployment: { year: 0, month: 8 },
				workaddress_totalmonthlyincomeorannually: 5000,
				previousworkaddress_companyname: 'Agency X',
				previousworkaddress_addressline1: '101 Creative Way',
				previousworkaddress_city: 'Chicago',
				previousworkaddress_state: 'IL',
				previousworkaddress_zipcode: '60610',
				previousworkaddress_occupationjobtitle: 'Junior Designer',
				previousworkaddress_timeatpreviousemployment: { year: 3, month: 0 },
				finaldetails_planneddownpayment: 1500,
				finaldetails_estimatedcreditscore: 720
			}
		},
		{
			name: 'Retired',
			data: {
				personalinformation_firstname: 'Robert',
				personalinformation_lastname: 'Brown',
				personalinformation_ssn: '456123789',
				personalinformation_dateofbirth: { mm: '12', dd: '10', yy: '1955' },
				personalinformation_phone: '(555) 456-7890',
				personalinformation_email: 'robert.brown@example.com',
				residence_addressline1: '555 Palm Dr',
				residence_city: 'Miami',
				residence_state: 'FL',
				residence_zipcode: '33101',
				residence_housingstatus: 'Own',
				residence_monthlypaymentyourportion: 0,
				residence_timeatcurrentaddress: { year: 15, month: 0 },
				employment_employmentstatus: 'Retired',
				finaldetails_planneddownpayment: 5000,
				finaldetails_estimatedcreditscore: 800
			}
		}
	]

	const currentTestIndex = ref(0)

	// NEW: Manual Fill Function (Dev Only)
	const fillTestData = () => {
		const testCase = testDataSets[currentTestIndex.value]
		if (!testCase) {
			return
		}

		const data: any = testCase.data

		schema.groups.forEach((group) => {
			group.inputs.forEach((input) => {
				const key = generateKey(group.heading, input.label)

				// Reset field
				if (input.components) {
					Object.keys(input.components).forEach((k) => (formData[key][k] = ''))
				} else {
					formData[key] = input.type === 'checkbox' ? false : ''
				}

				// Clear canvas if signature
				if (input.type === 'signature') {
					const canvas = signatureRefs.value[key]
					if (canvas) {
						const ctx = canvas.getContext('2d')
						ctx?.clearRect(0, 0, canvas.width, canvas.height)
					}
				}

				if (data[key] !== undefined) {
					if (input.components && typeof data[key] === 'object') {
						Object.assign(formData[key], data[key])
					} else {
						formData[key] = data[key]
					}
				} else {
					// Default required checkboxes
					if (input.type === 'checkbox' && input.required) {
						formData[key] = true
					}
					// Default down payment if not in test data
					if (input.label.includes('Down Payment') && !data[key]) {
						formData[key] = store.downPayment || 1000
					}

					// Auto-fill signature
					if (input.type === 'signature') {
						const canvas = signatureRefs.value[key]
						if (canvas) {
							const ctx = canvas.getContext('2d')
							if (ctx) {
								ctx.beginPath()
								ctx.moveTo(50, 100)
								ctx.bezierCurveTo(150, 50, 250, 150, 350, 100)
								ctx.strokeStyle = '#000'
								ctx.lineWidth = 2
								ctx.stroke()
								formData[key] = canvas.toDataURL()
							}
						}
					}
				}
			})
		})

		// Validate immediately to clear any existing errors and ensure logic runs
		checkErrors()

		ElMessage.success(`Test data filled: ${testCase.name}`)
		currentTestIndex.value = (currentTestIndex.value + 1) % testDataSets.length
	}

	const submitForm = () => {
		const firstErrorKey = checkErrors()
		if (firstErrorKey) {
			const element = itemRefs[firstErrorKey]
			if (element && element.$el) {
				element.$el.scrollIntoView({ behavior: 'smooth', block: 'center' })
				const inputElement = element.$el.querySelector('input, textarea, select')
				if (inputElement) inputElement.focus()
			}
			ElMessage({ message: 'Please correct the errors highlighted below.', type: 'error', duration: 3000 })
		} else {
			summaryVisible.value = true
		}
	}

	const confirmSubmission = async () => {
		const svg = `
	       <path class="path" d="
	         M 30 15
	         L 28 17
	         M 25.61 25.61
	         A 15 15, 0, 0, 1, 15 30
	         A 15 15, 0, 1, 1, 27.99 7.5
	         L 15 15
	       " style="stroke-width: 4px; fill: none;"/>
	     `

		const loading = ElLoading.service({
			lock: true,
			text: 'Processing your secure application...',
			background: 'rgba(0, 0, 0, 0.9)',
			svg: svg,
			svgViewBox: '-10, -10, 50, 50'
		})

		try {
			const response = await fetch(`${BACKEND_API_URL}/api/application`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					selected_vehicle: store.selectedVehicle
						? {
								...store.selectedVehicle
							}
						: { ...mockVehicle },
					loan_calculator_data: {
						vehicle_selling_price: store.price,
						down_payment: store.downPayment,
						interest_rate: store.interestRate,
						loan_term: store.loanTerm,
						trade_in_offer: store.tradeIn,
						amount_owed_on_trade_in: store.amountOwed,
						target_monthly_budget: store.filterMode === 'budget' ? store.monthlyBudget : null,
						filter_mode: store.filterMode
					}
				})
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || 'Server rejected request')
			}

			summaryVisible.value = false

			await ElMessageBox.alert(
				`
	               <div class="text-center">
	                   <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4 animate-bounce">
	                       <i class="fas fa-check text-4xl text-green-600"></i>
	                   </div>
	                   <h3 class="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
	                   <p class="text-gray-600">Your application has been securely transmitted. <br>Ref ID: #APP-${Math.floor(Math.random() * 10000)}</p>
	               </div>
	               `,
				{
					dangerouslyUseHTMLString: true,
					showConfirmButton: true,
					confirmButtonText: 'Return to Home',
					confirmButtonClass: 'bg-green-600 border-green-600 w-full font-bold hover:bg-green-700',
					center: true,
					customClass: 'custom-message-box',
					showClose: false,
					callback: () => {
						store.resetView()
						loading.close()
					}
				}
			)
		} catch (e) {
			await ElMessageBox.alert(
				`
	           <div class="text-center">
	               <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
	                   <i class="fas fa-exclamation-triangle text-4xl text-red-600"></i>
	               </div>
	               <h3 class="text-xl font-bold text-gray-800 mb-2">Submission Failed</h3>
	               <p class="text-gray-600 text-sm">We couldn't connect to the server. Please try again.</p>
	           </div>
	           `,
				{
					dangerouslyUseHTMLString: true,
					showConfirmButton: true,
					confirmButtonText: 'Try Again',
					confirmButtonClass: 'bg-red-600 border-red-600 w-full font-bold hover:bg-red-700',
					center: true,
					customClass: 'custom-message-box',
					showClose: false,
					callback: () => {
						loading.close()
					}
				}
			)
		}
	}

	const formatValue = (key: string, input: FormInput) => {
		const val = formData[key]
		if (input.components) {
			if (input.label.includes('birth')) return `${val.mm}/${val.dd}/${val.yy}`
			if (input.label.includes('Time')) return `${val.year} Years, ${val.month} Months`
			return JSON.stringify(val)
		}
		if (input.type === 'checkbox') return val ? 'Yes' : 'No'
		if (input.label.includes('Price') || input.label.includes('Income') || input.label.includes('Payment'))
			return `$ ${Number(val).toLocaleString()}`
		if (input.type === 'signature') return 'Signature Captured'
		return val
	}
</script>

<template>
	<div class="max-w-5xl mx-auto my-4 md:my-8 animate-[fadeIn_0.5s_ease-out]">
		<el-dialog
			v-model="summaryVisible"
			title="Review Application"
			width="90%"
			class="max-w-4xl"
			align-center
			append-to-body
		>
			<p class="text-slate-500 mb-4">Please review your details below before final submission.</p>

			<div v-if="store.selectedVehicle" class="mb-6">
				<el-card
					shadow="never"
					class="border border-blue-100 bg-blue-50/50 rounded-xl overflow-hidden"
					:body-style="{ padding: '0' }"
				>
					<div class="flex flex-col sm:flex-row">
						<div class="w-full sm:w-1/3 h-48 sm:h-auto relative bg-gray-200">
							<img
								:src="store.selectedVehicle.mediaUrls.length ? store.selectedVehicle.mediaUrls[0] : ''"
								class="w-full h-full object-cover"
								alt="Vehicle"
							/>
						</div>
						<div class="p-6 flex flex-col justify-center w-full sm:w-2/3">
							<div class="flex justify-between items-start">
								<div>
									<div class="text-sm text-blue-500 font-bold uppercase tracking-wider mb-1">
										Selected Vehicle
									</div>
									<h3 class="text-2xl font-bold text-slate-800 mb-1">
										{{ store.selectedVehicle.year }} {{ store.selectedVehicle.make }}
										{{ store.selectedVehicle.model }}
									</h3>
								</div>
								<div class="text-right">
									<div class="text-xs text-slate-500 uppercase font-bold">Total Price</div>
									<div class="text-xl font-extrabold text-slate-700">
										{{ formatCurrency(store.selectedVehicle.price) }}
									</div>
								</div>
							</div>

							<div class="mt-4 pt-4 border-t border-blue-200/60 grid grid-cols-2 gap-4">
								<div>
									<div class="text-xs text-slate-500 mb-1">Est. Monthly Payment</div>
									<div class="text-2xl font-extrabold text-blue-600">
										{{
											formatCurrency(store.calculatePaymentForPrice(store.selectedVehicle.price))
										}}
										<span class="text-sm font-normal text-slate-500">/mo</span>
									</div>
								</div>
								<div class="text-sm text-slate-600 space-y-1">
									<div class="flex justify-between">
										<span>Down Pmt:</span>
										<span class="font-bold">{{ formatCurrency(store.downPayment) }}</span>
									</div>
									<div class="flex justify-between">
										<span>Term:</span> <span class="font-bold">{{ store.loanTerm }} mos</span>
									</div>
									<div class="flex justify-between">
										<span>Rate:</span> <span class="font-bold">{{ store.interestRate }}%</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</el-card>
			</div>

			<div v-else class="mb-6">
				<el-card shadow="never" class="border border-gray-200 bg-gray-50 rounded-xl p-6">
					<div class="flex items-center gap-4">
						<div class="p-4 bg-indigo-100 rounded-full text-indigo-600">
							<i class="fas fa-file-signature text-2xl"></i>
						</div>
						<div>
							<h3 class="text-xl font-bold text-gray-800">General Financing Application</h3>
							<p class="text-gray-500 text-sm">
								You are applying for a pre-approval amount without a specific vehicle selected.
							</p>
						</div>
					</div>
				</el-card>
			</div>

			<div class="h-[50vh] overflow-y-auto pr-2">
				<template v-for="(group, gIndex) in schema.groups" :key="gIndex">
					<el-card
						shadow="never"
						class="mb-4 rounded-xl border border-gray-200"
						v-if="shouldShowGroup(group)"
					>
						<template #header>
							<div class="font-bold text-slate-700 text-lg">{{ group.heading }}</div>
						</template>
						<el-descriptions :column="1" border>
							<el-descriptions-item
								v-for="(input, iIndex) in group.inputs"
								:key="iIndex"
								:label="input.label"
								label-class-name="font-semibold text-slate-600 bg-slate-50 w-1/3"
							>
								<span
									v-if="
										input.type === 'checkbox' && !formData[generateKey(group.heading, input.label)]
									"
									class="text-slate-400"
									>No</span
								>
								<span v-else-if="input.type === 'checkbox'" class="text-green-600 font-bold"
									><i class="fas fa-check mr-1"></i> Agreed</span
								>
								<div
									v-else-if="
										input.type === 'signature' && formData[generateKey(group.heading, input.label)]
									"
								>
									<img
										:src="formData[generateKey(group.heading, input.label)]"
										class="h-12 object-contain border border-gray-200 rounded bg-white"
									/>
								</div>
								<span v-else>{{ formatValue(generateKey(group.heading, input.label), input) }}</span>
							</el-descriptions-item>
						</el-descriptions>
					</el-card>
				</template>
			</div>

			<template #footer>
				<div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
					<el-button size="large" @click="summaryVisible = false" class="w-full sm:w-auto">
						Edit Information
					</el-button>
					<el-button
						type="success"
						size="large"
						class="!px-8 !text-lg !font-bold w-full sm:w-auto"
						@click="confirmSubmission"
					>
						Confirm & Submit <i class="fas fa-paper-plane ml-2"></i>
					</el-button>
				</div>
			</template>
		</el-dialog>

		<div>
			<div class="flex justify-between items-center mb-6 px-2">
				<div>
					<h2 class="text-2xl md:text-3xl font-bold text-white drop-shadow-md">{{ schema.formHeading }}</h2>
					<p class="text-blue-200 mt-1 text-sm md:text-base">{{ schema.formDescription }}</p>
				</div>
				<div class="flex items-center gap-3">
					<el-button v-if="isDev" type="warning" plain size="default" @click="fillTestData">
						<i class="fas fa-flask mr-2"></i> Fill Test Data
					</el-button>

					<el-button type="danger" circle @click="store.resetView"><i class="fas fa-times"></i></el-button>
				</div>
			</div>

			<el-form label-position="top" @submit.prevent="submitForm">
				<div
					v-for="(group, gIndex) in schema.groups"
					:key="gIndex"
					class="mb-6"
					v-show="shouldShowGroup(group)"
				>
					<el-card shadow="hover" class="rounded-xl border-0 shadow-sm" :body-style="{ padding: '16px' }">
						<template #header>
							<div class="flex items-center">
								<i class="fas fa-caret-right text-blue-500 mr-2"></i><span>{{ group.heading }}</span>
							</div>
						</template>

						<el-row :gutter="24">
							<template v-for="(input, iIndex) in group.inputs" :key="iIndex">
								<el-col v-bind="getResponsiveProps(input)" v-if="shouldShowInput(group, input)">
									<el-form-item
										v-if="input.type === 'checkbox'"
										class="mb-2"
										:error="errors[generateKey(group.heading, input.label)]"
										:ref="(el: any) => setItemRef(el, generateKey(group.heading, input.label))"
									>
										<el-checkbox
											v-model="formData[generateKey(group.heading, input.label)]"
											size="large"
											class="whitespace-normal h-auto py-2"
										>
											<span v-if="input.label.includes('Privacy Policy')">
												I agree to the
												<a
													href="?showPrivacy=true"
													target="_blank"
													class="text-indigo-600 hover:underline"
													@click.stop
													>Privacy Policy</a
												>.
											</span>
											<span v-else>{{ input.label }}</span>
										</el-checkbox>
									</el-form-item>

									<el-form-item
										v-else-if="input.type === 'signature'"
										class="mb-6"
										:label="input.label + (input.required ? ' *' : '')"
										:error="errors[generateKey(group.heading, input.label)]"
										:ref="(el: any) => setItemRef(el, generateKey(group.heading, input.label))"
									>
										<div
											class="signature-pad-wrapper w-full border border-gray-300 rounded-lg overflow-hidden relative bg-white shadow-inner"
										>
											<canvas
												:ref="
													(el: any) =>
														setSignatureRef(el, generateKey(group.heading, input.label))
												"
												class="w-full h-40 cursor-crosshair touch-none block"
												width="600"
												height="200"
												@mousedown="
													(e) => startDrawing(e, generateKey(group.heading, input.label))
												"
												@mousemove="(e) => draw(e, generateKey(group.heading, input.label))"
												@mouseup="() => stopDrawing(generateKey(group.heading, input.label))"
												@mouseleave="() => stopDrawing(generateKey(group.heading, input.label))"
												@touchstart.passive="
													(e) => startDrawing(e, generateKey(group.heading, input.label))
												"
												@touchmove.prevent="
													(e) => draw(e, generateKey(group.heading, input.label))
												"
												@touchend="() => stopDrawing(generateKey(group.heading, input.label))"
											></canvas>
											<div class="absolute bottom-2 right-2">
												<el-button
													size="small"
													@click="clearSignature(generateKey(group.heading, input.label))"
													>Clear</el-button
												>
											</div>
										</div>
										<div class="text-xs text-gray-400 mt-1">
											Sign above using your mouse or finger.
										</div>
									</el-form-item>

									<el-form-item
										v-else
										:label="input.label + (input.required ? ' *' : '')"
										class="mb-6"
										:error="errors[generateKey(group.heading, input.label)]"
										:ref="(el: any) => setItemRef(el, generateKey(group.heading, input.label))"
									>
										<el-select
											v-if="input.type === 'select'"
											v-model="formData[generateKey(group.heading, input.label)]"
											placeholder="Select..."
											class="w-full"
											:filterable="['City', 'State'].includes(input.label)"
										>
											<el-option
												v-for="opt in resolveOptions(input.options)"
												:key="opt"
												:label="opt"
												:value="opt"
											/>
										</el-select>

										<div v-else-if="input.components" class="w-full flex gap-2">
											<div
												v-for="(compConfig, compKey) in input.components"
												:key="compKey"
												class="flex-1"
											>
												<el-select
													v-if="compConfig.type === 'select'"
													v-model="formData[generateKey(group.heading, input.label)][compKey]"
													:placeholder="compKey.toUpperCase()"
												>
													<el-option
														v-for="opt in resolveOptions(compConfig.options)"
														:key="opt"
														:label="opt"
														:value="opt"
													/>
												</el-select>
												<el-input
													v-else
													v-model="formData[generateKey(group.heading, input.label)][compKey]"
													:placeholder="compKey"
													type="number"
												>
													<template #prepend v-if="compKey === 'year' || compKey === 'month'">
														{{ compKey === 'year' ? 'Year' : 'Month' }}
													</template>
												</el-input>
											</div>
										</div>

										<el-input
											v-else
											v-model="formData[generateKey(group.heading, input.label)]"
											:type="
												input.type === 'number'
													? 'number'
													: input.type === 'password'
														? 'password'
														: 'text'
											"
											:placeholder="input.format || ''"
											:show-password="input.type === 'password'"
										>
											<template
												#prefix
												v-if="
													input.label.includes('Price') ||
													input.label.includes('Payment') ||
													input.label.includes('Income')
												"
												><i class="fas fa-dollar-sign"></i
											></template>
										</el-input>
									</el-form-item>
								</el-col>
							</template>
						</el-row>
					</el-card>
				</div>
				<div class="flex flex-col-reverse md:flex-row justify-end gap-4 mt-8 pb-10">
					<el-button size="large" @click="store.resetView" class="w-full md:w-auto">Cancel</el-button>
					<el-button type="primary" size="large" native-type="submit" class="!px-8 !text-lg w-full md:w-auto"
						>Review Application <i class="fas fa-arrow-right ml-2"></i
					></el-button>
				</div>
			</el-form>
		</div>
	</div>
</template>
