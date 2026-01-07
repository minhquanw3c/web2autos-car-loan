<script setup lang="ts">
	import { ref, reactive } from 'vue'
	import { useLoanStore } from '@/stores/loan'
	import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
	import type { FormSchema, FormInput } from '@/types'
	import { BACKEND_API_URL } from '@/constants/utils'

	const store = useLoanStore()
	const summaryVisible = ref(false)

	// Helper for currency formatting
	const formatCurrency = (val: number) => {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)
	}

	// 1. Schema
	const schema: FormSchema = {
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
					{ label: 'Current Address', type: 'text', required: true },
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
					{ label: 'Address', type: 'text', required: true },
					{ label: 'Company Name', type: 'text', required: true },
					{ label: 'Address Line 1', type: 'text', required: true },
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
					{ label: 'Total Monthly Income or Annually', type: 'number', required: true }
				]
			},
			{
				heading: 'Final details',
				inputs: [
					{ label: 'Ok to run credit reports by our top rated dealership', type: 'checkbox', default: false },
					{ label: 'How much of Down Payment?', type: 'number', required: true },
					{
						label: 'I authorize this dealership to run my credit report.',
						type: 'checkbox',
						default: false,
						required: true
					},
					{
						label: 'I agree to the collection and processing of my personal data.',
						type: 'checkbox',
						default: false,
						required: true
					},
					{ label: 'I agree to receive newsletters.', type: 'checkbox', default: false, required: false }
				]
			}
		]
	}

	// 2. State & Seeding
	const formData = reactive<Record<string, any>>({})
	const errors = reactive<Record<string, string>>({})
	const itemRefs = reactive<Record<string, any>>({})

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

	const generateKey = (groupHeading: string, label: string) => {
		const prefix = groupHeading.replace(/\s+/g, '').toLowerCase()
		const suffix = label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
		return `${prefix}_${suffix}`
	}

	const setItemRef = (el: any, key: string) => {
		if (el) itemRefs[key] = el
	}

	// Init & Seed Data
	schema.groups.forEach((group) => {
		group.inputs.forEach((input) => {
			const key = generateKey(group.heading, input.label)
			if (input.components) {
				formData[key] = {}
				if (input.components) {
					Object.keys(input.components).forEach((compKey) => {
						let val: any = ''
						// Seeding complex
						if (key.includes('dateofbirth')) {
							if (compKey === 'mm') val = '5'
							if (compKey === 'dd') val = '15'
							if (compKey === 'yy') val = '1990'
						} else if (key.includes('time')) {
							if (compKey === 'year') val = 2
							if (compKey === 'month') val = 6
						}
						formData[key][compKey] = val
					})
				}
			} else {
				let val: any = ''
				// Seeding standard
				if (input.label.includes('First Name')) val = 'John'
				else if (input.label.includes('Last Name')) val = 'Doe'
				else if (input.label.includes('SSN')) val = '123456789'
				else if (input.label.includes('Email')) val = 'john.doe@example.com'
				else if (input.label.includes('Phone') && !input.label.includes('Work')) val = '(555) 123-4567'
				else if (input.label.includes('Current Address')) val = '123 Maple Street'
				else if (input.label.includes('Address Line 1')) val = 'Apt 4B'
				else if (input.label.includes('City')) val = 'New York'
				else if (input.label.includes('State')) val = 'NY'
				else if (input.label.includes('Zip Code')) val = '10001'
				else if (input.label.includes('Housing Status')) val = 'Rent'
				else if (input.label.includes('Monthly Payment')) val = 1500
				else if (input.label.includes('Employment Status')) val = 'Employed'
				else if (input.label.includes('Company Name')) val = 'Tech Corp'
				else if (input.label.includes('Occupation')) val = 'Software Engineer'
				else if (input.label.includes('Income')) val = 8500
				else if (input.label.includes('Down Payment')) val = store.downPayment
				else if (input.type === 'checkbox' && input.required) val = true

				formData[key] = val
			}
		})
	})

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
		if (l === 'current address' || l === 'address') return { xs: 24, sm: 24, md: 24, lg: 24 }
		return { xs: 24, sm: 12, md: 12, lg: 8 }
	}

	const checkErrors = () => {
		Object.keys(errors).forEach((key) => delete errors[key])
		let firstErrorKey: string | null = null

		schema.groups.forEach((group) => {
			group.inputs.forEach((input) => {
				const key = generateKey(group.heading, input.label)
				let errorMsg: string | null = null

				if (input.required) {
					if (input.components) {
						const parts = formData[key]
						if (Object.values(parts).some((val) => !val))
							errorMsg = `Please complete the ${input.label.toLowerCase()}.`
					} else {
						const val = formData[key]
						if (!val && val !== 0)
							errorMsg =
								input.type === 'checkbox' ? 'This field is required.' : `${input.label} is required.`
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
						: null,
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
		return val
	}
</script>

<template>
	<div class="max-w-5xl mx-auto my-4 md:my-8 animate-[fadeIn_0.5s_ease-out]">
		<!-- SUMMARY MODAL (NEW) -->
		<el-dialog v-model="summaryVisible" title="Review Application" width="90%" class="max-w-4xl" align-center>
			<p class="text-slate-500 mb-4">Please review your details below before final submission.</p>

			<!-- SELECTED VEHICLE SUMMARY -->
			<div v-if="store.selectedVehicle" class="mb-6">
				<el-card
					shadow="never"
					class="border border-blue-100 bg-blue-50/50 rounded-xl overflow-hidden"
					:body-style="{ padding: '0' }"
				>
					<div class="flex flex-col sm:flex-row">
						<div class="w-full sm:w-1/3 h-48 sm:h-auto relative bg-gray-200">
							<!-- Updated to use mediaUrl to match VehicleGrid -->
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

							<!-- NEW: Monthly Payment & Loan Details -->
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

			<div class="h-[50vh] overflow-y-auto pr-2">
				<el-card
					shadow="never"
					class="mb-4 rounded-xl border border-gray-200"
					v-for="(group, gIndex) in schema.groups"
					:key="gIndex"
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
								v-if="input.type === 'checkbox' && !formData[generateKey(group.heading, input.label)]"
								class="text-slate-400"
								>No</span
							>
							<span v-else-if="input.type === 'checkbox'" class="text-green-600 font-bold"
								><i class="fas fa-check mr-1"></i> Agreed</span
							>
							<span v-else>{{ formatValue(generateKey(group.heading, input.label), input) }}</span>
						</el-descriptions-item>
					</el-descriptions>
				</el-card>
			</div>

			<template #footer>
				<div class="flex justify-end gap-3 pt-4">
					<el-button size="large" @click="summaryVisible = false">Edit Information</el-button>
					<el-button type="success" size="large" class="!px-8 !text-lg !font-bold" @click="confirmSubmission">
						Confirm & Submit <i class="fas fa-paper-plane ml-2"></i>
					</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- FORM VIEW -->
		<div>
			<div class="flex justify-between items-center mb-6 px-2">
				<div>
					<h2 class="text-2xl md:text-3xl font-bold text-white drop-shadow-md">{{ schema.formHeading }}</h2>
					<p class="text-blue-200 mt-1 text-sm md:text-base">{{ schema.formDescription }}</p>
				</div>
				<el-button type="danger" circle @click="store.resetView"><i class="fas fa-times"></i></el-button>
			</div>

			<el-form label-position="top" @submit.prevent="submitForm">
				<div v-for="(group, gIndex) in schema.groups" :key="gIndex" class="mb-6">
					<el-card shadow="hover" class="rounded-xl border-0 shadow-sm" :body-style="{ padding: '16px' }">
						<template #header>
							<div class="flex items-center">
								<i class="fas fa-caret-right text-blue-500 mr-2"></i><span>{{ group.heading }}</span>
							</div>
						</template>

						<el-row :gutter="24">
							<el-col
								v-for="(input, iIndex) in group.inputs"
								:key="iIndex"
								v-bind="getResponsiveProps(input)"
							>
								<!-- Checkbox Field -->
								<el-form-item
									v-if="input.type === 'checkbox'"
									class="mb-2"
									:error="errors[generateKey(group.heading, input.label)]"
									:ref="(el: any) => setItemRef(el, generateKey(group.heading, input.label))"
								>
									<el-checkbox
										v-model="formData[generateKey(group.heading, input.label)]"
										:label="input.label"
										size="large"
										class="whitespace-normal h-auto py-2"
									/>
								</el-form-item>

								<!-- Standard & Complex Fields -->
								<el-form-item
									v-else
									:label="input.label + (input.required ? ' *' : '')"
									class="mb-6"
									:error="errors[generateKey(group.heading, input.label)]"
									:ref="(el: any) => setItemRef(el, generateKey(group.heading, input.label))"
								>
									<!-- Select -->
									<el-select
										v-if="input.type === 'select'"
										v-model="formData[generateKey(group.heading, input.label)]"
										placeholder="Select..."
										class="w-full"
									>
										<el-option
											v-for="opt in resolveOptions(input.options)"
											:key="opt"
											:label="opt"
											:value="opt"
										/>
									</el-select>

									<!-- Complex (Date/Duration) -->
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
											/>
										</div>
									</div>

									<!-- Standard Text/Number -->
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
