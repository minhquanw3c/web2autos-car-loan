<script setup lang="ts">
	import { ref, reactive } from 'vue'
	import { ElMessage, ElMessageBox } from 'element-plus'
	import type { FormSchema, FormInput } from '@/types'
	import { BACKEND_API_URL, CAR_FINDER_BODY_STYLE, CAR_FINDER_MAKES } from '@/constants/utils'
	import FullScreenLoader from '@/components/FullScreenLoader.vue'

	const summaryVisible = ref(false)
	const isSubmitting = ref(false)

	const formatCurrency = (val: number) =>
		new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

	const priceOptions = ['Any', ...Array.from({ length: 100 }, (_, i) => formatCurrency((i + 1) * 1000))]
	const mpgOptions = ['Any', ...Array.from({ length: 11 }, (_, i) => String(10 + i * 5))]
	const paymentOptions = Array.from({ length: 17 }, (_, i) => formatCurrency(100 + i * 50))
	const seatOptions = ['Any', ...Array.from({ length: 15 }, (_, i) => `${i + 1}+`)]

	const schema = reactive<FormSchema>({
		formHeading: 'Car finder',
		formDescription:
			"We're ready to take the work out of car shopping! Simply tell us what you're looking for and we'll find your perfect fit.",
		groups: [
			{
				heading: 'Tell us about you',
				inputs: [
					{ label: 'First name', type: 'text', required: true, maxLength: 50 } as any,
					{ label: 'Last name', type: 'text', required: true, maxLength: 50 } as any,
					{ label: 'Email', type: 'email', required: true, maxLength: 100 } as any,
					{ label: 'Phone', type: 'text', required: true, format: '(XXX) XXX-XXXX', masked: true },
					{ label: 'Zip code', type: 'text', required: true }
				]
			},
			{
				heading: "Tell us what you're looking for",
				inputs: [
					{
						label: 'Condition',
						type: 'select',
						required: true,
						options: ['Any', 'New', 'Used', 'Certified']
					},
					{
						label: 'Body style',
						type: 'select',
						options: CAR_FINDER_BODY_STYLE
					},
					{
						label: 'Make',
						type: 'select',
						options: CAR_FINDER_MAKES,
						default: 'Any'
					},
					{ label: 'Model', type: 'text' },
					{ label: 'Trim/Package', type: 'text' },
					{
						label: 'Transmission',
						type: 'select',
						options: ['Any', 'Automatic', 'CVT', 'Manual'],
						default: 'Any'
					},
					{
						label: 'Min Highway MPG',
						type: 'select',
						options: mpgOptions,
						default: 'Any'
					},
					{
						label: 'Max Mileage',
						type: 'select',
						options: [
							'Any',
							'5,000',
							'10,000',
							'20,000',
							'30,000',
							'50,000',
							'75,000',
							'100,000',
							'150,000'
						],
						default: 'Any'
					},
					{ label: 'Year Min', type: 'text' },
					{ label: 'Year Max', type: 'text' },
					{ label: 'Preferred Exterior Color', type: 'text' },
					{ label: 'Preferred Interior Color', type: 'text' },
					{
						label: 'Min Price',
						type: 'select',
						options: priceOptions,
						default: 'Any'
					},
					{
						label: 'Max Price',
						type: 'select',
						options: priceOptions,
						default: 'Any'
					},
					{
						label: 'Max Monthly Payment',
						type: 'select',
						options: paymentOptions
					},
					{ label: 'Engine', type: 'text' },
					{
						label: 'Drivetrain',
						type: 'select',
						options: ['Any', 'FWD', 'RWD', 'AWD', '4WD', '4X4', '4X2', '6X4'],
						default: 'Any'
					},
					{
						label: 'Fuel Type',
						type: 'select',
						options: [
							'Any',
							'Gasoline',
							'Flex Fuel',
							'Diesel',
							'Bio Diesel',
							'Gas/Electric Hybrid',
							'Plug-in Hybrid',
							'Electric'
						],
						default: 'Any'
					},
					{
						label: 'Seats',
						type: 'select',
						options: seatOptions,
						default: 'Any'
					},
					{
						label: 'Seating Rows',
						type: 'select',
						options: ['Any', '1', '2', '3', '4', '5'],
						default: 'Any'
					},
					{
						label: 'Doors',
						type: 'select',
						options: ['Any', '2', '3', '4', '5'],
						default: 'Any'
					}
				]
			}
		]
	})

	const formData = reactive<Record<string, any>>({})
	const errors = reactive<Record<string, string>>({})
	const itemRefs = reactive<Record<string, any>>({})

	const generateKey = (groupHeading: string, label: string) => {
		const prefix = groupHeading.replace(/\s+/g, '').toLowerCase()
		const suffix = label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
		return `${prefix}_${suffix}`
	}

	const handleMaskInput = (val: string, key: string, input: FormInput) => {
		if (!input.masked) return

		const digits = val.replace(/\D/g, '')
		let formatted = digits

		if (input.label === 'Phone') {
			if (digits.length === 0) formatted = ''
			else if (digits.length <= 3) formatted = `(${digits}`
			else if (digits.length <= 6) formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`
			else formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
		}

		formData[key] = formatted
	}

	const validatePhone = (val: string) => {
		const digits = val.replace(/\D/g, '')
		return digits.length === 10
	}

	const setItemRef = (el: any, key: string) => {
		if (el) itemRefs[key] = el
	}

	// Initialize form data
	schema.groups.forEach((group) => {
		group.inputs.forEach((input) => {
			const key = generateKey(group.heading, input.label)
			formData[key] = input.default !== undefined ? input.default : ''
		})
	})

	const getResponsiveProps = () => {
		return { xs: 24, sm: 12, md: 8, lg: 8 }
	}

	const checkErrors = () => {
		Object.keys(errors).forEach((key) => delete errors[key])
		let firstErrorKey: string | null = null

		schema.groups.forEach((group) => {
			group.inputs.forEach((input) => {
				const key = generateKey(group.heading, input.label)
				let errorMsg: string | null = null
				const val = formData[key]

				if (input.required && !val) {
					errorMsg = `${input.label} is required.`
				}

				if (!errorMsg && input.type === 'email' && val) {
					if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) errorMsg = 'Please enter a valid email address.'
				}

				if (!errorMsg && input.label === 'Phone' && val) {
					if (!validatePhone(val)) errorMsg = 'Please enter a valid 10-digit phone number.'
				}

				if (!errorMsg && (input as any).maxLength && val && String(val).length > (input as any).maxLength) {
					errorMsg = `Cannot exceed ${(input as any).maxLength} characters.`
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
		isSubmitting.value = true

		const payload = { ...formData }
		// Strip currency formatting before sending to backend
		Object.keys(payload).forEach((key) => {
			if (typeof payload[key] === 'string' && payload[key].startsWith('$')) {
				payload[key] = payload[key].replace(/[$,]/g, '')
			}
		})

		try {
			const response = await fetch(`${BACKEND_API_URL}/api/car-finder`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || 'Server rejected request')
			}

			isSubmitting.value = false
			summaryVisible.value = false

			await ElMessageBox.alert(
				`
               <div class="text-center">
                   <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4 animate-bounce">
                       <i class="fas fa-check text-4xl text-green-600"></i>
                   </div>
                   <h3 class="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
                   <p class="text-gray-600">Your car finder request has been securely transmitted.</p>
               </div>
               `,
				{
					dangerouslyUseHTMLString: true,
					showConfirmButton: true,
					confirmButtonText: 'Done',
					confirmButtonClass: 'bg-green-600 border-green-600 w-full font-bold hover:bg-green-700',
					center: true,
					customClass: 'custom-message-box',
					showClose: false
				}
			)
			// Reset form
			Object.keys(formData).forEach((key) => (formData[key] = ''))
		} catch (e) {
			isSubmitting.value = false
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
					showClose: false
				}
			)
		}
	}
</script>

<template>
	<Teleport to="body">
		<FullScreenLoader :visible="isSubmitting" text="Processing your request..." />
	</Teleport>
	<div class="max-w-4xl mx-auto my-4 md:my-8 animate-[fadeIn_0.5s_ease-out]">
		<el-dialog
			v-model="summaryVisible"
			title="Review Information"
			width="90%"
			class="max-w-2xl"
			align-center
			append-to-body
		>
			<p class="text-slate-500 mb-4">Please review your details below before final submission.</p>

			<div class="max-h-[60vh] overflow-y-auto pr-2">
				<template v-for="(group, gIndex) in schema.groups" :key="gIndex">
					<el-card shadow="never" class="mb-4 rounded-xl border border-gray-200">
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
								<span>{{ formData[generateKey(group.heading, input.label)] }}</span>
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
						class="!px-8 !font-bold w-full sm:w-auto"
						@click="confirmSubmission"
					>
						Confirm & Submit <i class="fas fa-paper-plane ml-2"></i>
					</el-button>
				</div>
			</template>
		</el-dialog>

		<div>
			<div class="mb-6 px-2">
				<h2 class="text-2xl md:text-3xl font-bold text-white drop-shadow-md">{{ schema.formHeading }}</h2>
				<p class="text-blue-200 mt-1 text-sm md:text-base">{{ schema.formDescription }}</p>
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
							<template v-for="(input, iIndex) in group.inputs" :key="iIndex">
								<el-col v-bind="getResponsiveProps()">
									<el-form-item
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
											filterable
										>
											<el-option
												v-for="opt in input.options"
												:key="opt as string"
												:label="opt"
												:value="opt"
											/>
										</el-select>

										<el-input
											v-else
											v-model="formData[generateKey(group.heading, input.label)]"
											:type="input.type"
											:placeholder="input.format || ''"
											:maxlength="(input as any).maxLength"
											@input="
												(val: string) =>
													handleMaskInput(val, generateKey(group.heading, input.label), input)
											"
										/>
									</el-form-item>
								</el-col>
							</template>
						</el-row>
					</el-card>
				</div>
				<div class="flex flex-col-reverse md:flex-row justify-end gap-4 mt-8 pb-10">
					<el-button type="primary" size="large" native-type="submit" class="!px-8 !text-lg w-full md:w-auto">
						Review Details <i class="fas fa-arrow-right ml-2"></i>
					</el-button>
				</div>
			</el-form>
		</div>
	</div>
</template>
