<script setup lang="ts">
	import { reactive, ref } from 'vue'
	import { useLoanStore } from '@/stores/loan'
	import axios from 'axios'
	import { ElMessage } from 'element-plus'
	import { DealershipInquirySchema } from '@/schemas/dealershipInquiry'
	import { BACKEND_API_URL } from '@/constants/utils'
	import FullScreenLoader from '@/components/FullScreenLoader.vue'

	const store = useLoanStore()
	const formRef = ref()
	const isDev = import.meta.env.DEV
	const isSubmitting = ref(false)

	const form = reactive({
		dealership_name: '',
		is_franchise: '',
		gm_firstname: '',
		gm_lastname: '',
		address_line1: '',
		address_line2: '',
		city: '',
		state: '',
		zip_code: '',
		phone: '',
		email: '',
		best_time_to_contact: '',
		sub_prime_department: '',
		website: '',
		note: ''
	})

	const errors = reactive<Record<string, string>>({})
	const itemRefs = ref<Record<string, any>>({})

	const setItemRef = (el: any, key: string) => {
		if (el) itemRefs.value[key] = el
	}

	const fieldOrder = [
		'dealership_name',
		'is_franchise',
		'gm_firstname',
		'gm_lastname',
		'address_line1',
		'address_line2',
		'city',
		'state',
		'zip_code',
		'phone',
		'email',
		'best_time_to_contact',
		'sub_prime_department',
		'website',
		'note'
	]

	const testDataSets = [
		{
			name: 'Franchise Dealer',
			data: {
				dealership_name: 'Sunnyvale Toyota',
				is_franchise: 'Yes',
				gm_firstname: 'Michael',
				gm_lastname: 'Scott',
				address_line1: '890 El Camino Real',
				address_line2: 'Building B',
				city: 'Sunnyvale',
				state: 'CA',
				zip_code: '94087',
				phone: '(408) 555-0123',
				email: 'mscott@sunnyvaletoyota.com',
				best_time_to_contact: 'Morning',
				sub_prime_department: 'Yes',
				website: 'www.sunnyvaletoyota.com',
				note: 'We are looking to expand our lead sources.'
			}
		},
		{
			name: 'Independent Dealer',
			data: {
				dealership_name: 'Best Choice Autos',
				is_franchise: 'No',
				gm_firstname: 'Jim',
				gm_lastname: 'Halpert',
				address_line1: '123 Main St',
				address_line2: '',
				city: 'San Jose',
				state: 'CA',
				zip_code: '95112',
				phone: '(408) 555-9999',
				email: 'jim@bestchoiceautos.com',
				best_time_to_contact: 'Afternoon',
				sub_prime_department: 'No',
				website: 'www.bestchoiceautos.com',
				note: 'Interested in sub-prime leads specifically.'
			}
		}
	]

	const currentTestIndex = ref(0)

	const fillTestData = () => {
		const testCase = testDataSets[currentTestIndex.value]

		if (!testCase) {
			return
		}

		Object.assign(form, testCase.data)
		ElMessage.success(`Test data filled: ${testCase.name}`)
		currentTestIndex.value = (currentTestIndex.value + 1) % testDataSets.length
	}

	const validateForm = () => {
		// Clear previous errors
		Object.keys(errors).forEach((key) => delete errors[key])

		const result = DealershipInquirySchema.safeParse(form)

		if (!result.success) {
			result.error.issues.forEach((issue) => {
				const path = issue.path[0]?.toString()
				if (path) {
					errors[path] = issue.message
				}
			})
			return false
		}
		return true
	}

	const submitForm = async () => {
		if (!validateForm()) {
			const firstErrorField = fieldOrder.find((key) => errors[key])
			if (firstErrorField) {
				const el = itemRefs.value[firstErrorField]
				if (el) {
					el.scrollIntoView({ behavior: 'smooth', block: 'center' })
				}
			}
			ElMessage.error('Please correct the errors in the form.')
			return
		}

		isSubmitting.value = true
		try {
			await axios.post(`${BACKEND_API_URL}/api/dealership-inquiry`, form)
			ElMessage.success('Inquiry submitted successfully! We will contact you shortly.')
		} catch (error) {
			ElMessage.error('Failed to submit inquiry. Please try again.')
		} finally {
			isSubmitting.value = false
		}
	}
</script>

<template>
	<Teleport to="body">
		<FullScreenLoader :visible="isSubmitting" text="Submitting Inquiry..." />
	</Teleport>
	<div class="max-w-[1600px] mx-auto my-8 px-4 sm:px-6 lg:px-8 animate-[fadeIn_0.5s_ease-out]">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
			<!-- Left Column: Information -->
			<div class="text-slate-300 space-y-8 lg:sticky lg:top-24">
				<div class="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/20">
					<div class="relative pt-[56.25%]">
						<iframe
							src="https://player.vimeo.com/video/1129471498"
							class="absolute top-0 left-0 w-full h-full"
							frameborder="0"
							allow="autoplay; fullscreen; picture-in-picture"
							allowfullscreen
						></iframe>
					</div>
				</div>

				<div>
					<h1 class="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
						Dealership Inquiry Why - It’s Important and Why Choose Us
					</h1>
					<p class="text-lg leading-relaxed">
						A dealership inquiry is the first step in ensuring you make an informed decision when purchasing
						your next vehicle. Whether you’re interested in new or pre-owned cars, the inquiry process
						allows you to communicate directly with our team to get the answers, pricing details, and
						vehicle information you need. This personalized approach ensures you choose the best car,
						financing options, and promotions available to you.
					</p>
				</div>

				<div>
					<h3 class="text-2xl font-bold text-white mb-4">Why Make a Dealership Inquiry?</h3>
					<p class="mb-4">A dealership inquiry is crucial for several reasons:</p>
					<ul class="space-y-3">
						<li class="flex items-start gap-3">
							<i class="fas fa-check-circle text-indigo-500 mt-1"></i>
							<span
								><strong>Direct Communication:</strong> You can communicate directly with our sales
								team, ensuring all your questions are answered promptly.</span
							>
						</li>
						<li class="flex items-start gap-3">
							<i class="fas fa-check-circle text-indigo-500 mt-1"></i>
							<span
								><strong>Vehicle Information:</strong> Get detailed specifications, availability, and
								pricing for the car you’re interested in.</span
							>
						</li>
						<li class="flex items-start gap-3">
							<i class="fas fa-check-circle text-indigo-500 mt-1"></i>
							<span
								><strong>Exclusive Offers:</strong> Be the first to know about exclusive dealership
								promotions and discounts.</span
							>
						</li>
						<li class="flex items-start gap-3">
							<i class="fas fa-check-circle text-indigo-500 mt-1"></i>
							<span
								><strong>Test Drive Scheduling:</strong> Easily schedule a test drive to see the car in
								person before making your decision.</span
							>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="text-2xl font-bold text-white mb-4">Why Choose Our Dealership?</h3>
					<p class="mb-4">
						There are many reasons why our customers keep coming back. Here’s why you should choose us:
					</p>
					<ul class="space-y-3">
						<li class="flex items-start gap-3">
							<i class="fas fa-star text-yellow-500 mt-1"></i>
							<span
								><strong>Wide Range of Cars:</strong> We offer a variety of both new and pre-owned cars,
								catering to all budgets and preferences.</span
							>
						</li>
						<li class="flex items-start gap-3">
							<i class="fas fa-star text-yellow-500 mt-1"></i>
							<span
								><strong>Competitive Pricing:</strong> We guarantee you the best prices, making sure you
								get excellent value for your money.</span
							>
						</li>
						<li class="flex items-start gap-3">
							<i class="fas fa-star text-yellow-500 mt-1"></i>
							<span
								><strong>Exceptional Customer Service:</strong> Our friendly and knowledgeable team is
								here to guide you through every step of your car-buying journey.</span
							>
						</li>
						<li class="flex items-start gap-3">
							<i class="fas fa-star text-yellow-500 mt-1"></i>
							<span
								><strong>Flexible Financing Options:</strong> We offer tailored financing plans to make
								your purchase more affordable.</span
							>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="text-2xl font-bold text-white mb-4">
						What Happens After You Submit a Dealership Inquiry?
					</h3>
					<p class="leading-relaxed">
						Once you submit your dealership inquiry, our team will reach out to you to discuss your needs,
						provide details on your vehicle of interest, and assist with financing options. We are here to
						help every step of the way to ensure you drive away in the car that fits you best.
					</p>
				</div>

				<div class="bg-indigo-900/30 p-6 rounded-xl border border-indigo-500/30">
					<h3 class="text-xl font-bold text-white mb-2">Find the Best Deal for Your Next Car</h3>
					<p class="text-indigo-200">
						Start your dealership inquiry now and get personalized assistance in choosing the right vehicle
						for you. Whether you’re looking for the latest models or a pre-owned gem, we’re here to help you
						find the perfect car.
					</p>
				</div>
			</div>

			<!-- Right Column: Form -->
			<div>
				<div class="mb-6">
					<h2 class="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-md">Partner With Us</h2>
					<p class="text-blue-200 text-lg">
						Join our network of trusted dealerships. Fill out the form below and our team will get back to
						you.
					</p>
				</div>

				<div class="flex justify-end mb-4" v-if="isDev">
					<el-button type="warning" plain size="default" @click="fillTestData">
						<i class="fas fa-flask mr-2"></i> Fill Test Data
					</el-button>
				</div>

				<el-card class="rounded-2xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
					<form @submit.prevent="submitForm" class="space-y-8 p-4 md:p-8">
						<!-- Section 1: Dealership Info -->
						<div>
							<h3 class="text-xl font-bold text-slate-800 mb-4 border-b pb-2 border-slate-200">
								<i class="fas fa-building text-indigo-600 mr-2"></i> Dealership Information
							</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div class="md:col-span-2" :ref="(el) => setItemRef(el, 'dealership_name')">
									<label class="block text-sm font-bold text-slate-700 mb-1">Dealership Name</label>
									<el-input
										v-model="form.dealership_name"
										placeholder="Enter dealership name"
										size="large"
									/>
									<div v-if="errors.dealership_name" class="text-red-500 text-xs mt-1">
										{{ errors.dealership_name }}
									</div>
								</div>

								<div :ref="(el) => setItemRef(el, 'is_franchise')">
									<label class="block text-sm font-bold text-slate-700 mb-1"
										>Franchise Dealership?</label
									>
									<el-select
										v-model="form.is_franchise"
										placeholder="Select..."
										size="large"
										class="w-full"
									>
										<el-option label="Yes" value="Yes" />
										<el-option label="No" value="No" />
									</el-select>
									<div v-if="errors.is_franchise" class="text-red-500 text-xs mt-1">
										{{ errors.is_franchise }}
									</div>
								</div>

								<div class="hidden md:block"></div>

								<div :ref="(el) => setItemRef(el, 'gm_firstname')">
									<label class="block text-sm font-bold text-slate-700 mb-1">GM First Name</label>
									<el-input
										v-model="form.gm_firstname"
										placeholder="General Manager First Name"
										size="large"
									/>
									<div v-if="errors.gm_firstname" class="text-red-500 text-xs mt-1">
										{{ errors.gm_firstname }}
									</div>
								</div>

								<div :ref="(el) => setItemRef(el, 'gm_lastname')">
									<label class="block text-sm font-bold text-slate-700 mb-1">GM Last Name</label>
									<el-input
										v-model="form.gm_lastname"
										placeholder="General Manager Last Name"
										size="large"
									/>
									<div v-if="errors.gm_lastname" class="text-red-500 text-xs mt-1">
										{{ errors.gm_lastname }}
									</div>
								</div>
							</div>
						</div>

						<!-- Section 2: Address -->
						<div>
							<h3 class="text-xl font-bold text-slate-800 mb-4 border-b pb-2 border-slate-200">
								<i class="fas fa-map-marker-alt text-indigo-600 mr-2"></i> Location
							</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div class="md:col-span-2" :ref="(el) => setItemRef(el, 'address_line1')">
									<label class="block text-sm font-bold text-slate-700 mb-1">Address Line 1</label>
									<el-input v-model="form.address_line1" placeholder="Street address" size="large" />
									<div v-if="errors.address_line1" class="text-red-500 text-xs mt-1">
										{{ errors.address_line1 }}
									</div>
								</div>

								<div class="md:col-span-2" :ref="(el) => setItemRef(el, 'address_line2')">
									<label class="block text-sm font-bold text-slate-700 mb-1"
										>Address Line 2 (Optional)</label
									>
									<el-input
										v-model="form.address_line2"
										placeholder="Suite, Unit, etc."
										size="large"
									/>
									<div v-if="errors.address_line2" class="text-red-500 text-xs mt-1">
										{{ errors.address_line2 }}
									</div>
								</div>

								<div :ref="(el) => setItemRef(el, 'city')">
									<label class="block text-sm font-bold text-slate-700 mb-1">City</label>
									<el-input v-model="form.city" placeholder="City" size="large" />
									<div v-if="errors.city" class="text-red-500 text-xs mt-1">{{ errors.city }}</div>
								</div>

								<div class="grid grid-cols-2 gap-4">
									<div :ref="(el) => setItemRef(el, 'state')">
										<label class="block text-sm font-bold text-slate-700 mb-1">State</label>
										<el-input v-model="form.state" placeholder="State" size="large" />
										<div v-if="errors.state" class="text-red-500 text-xs mt-1">
											{{ errors.state }}
										</div>
									</div>
									<div :ref="(el) => setItemRef(el, 'zip_code')">
										<label class="block text-sm font-bold text-slate-700 mb-1">Zip Code</label>
										<el-input v-model="form.zip_code" placeholder="Zip Code" size="large" />
										<div v-if="errors.zip_code" class="text-red-500 text-xs mt-1">
											{{ errors.zip_code }}
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Section 3: Contact -->
						<div>
							<h3 class="text-xl font-bold text-slate-800 mb-4 border-b pb-2 border-slate-200">
								<i class="fas fa-address-card text-indigo-600 mr-2"></i> Contact Details
							</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div :ref="(el) => setItemRef(el, 'phone')">
									<label class="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
									<el-input v-model="form.phone" placeholder="(555) 555-5555" size="large" />
									<div v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</div>
								</div>

								<div :ref="(el) => setItemRef(el, 'email')">
									<label class="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
									<el-input v-model="form.email" placeholder="contact@dealership.com" size="large" />
									<div v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</div>
								</div>

								<div :ref="(el) => setItemRef(el, 'best_time_to_contact')">
									<label class="block text-sm font-bold text-slate-700 mb-1"
										>Best Time to Contact</label
									>
									<el-select
										v-model="form.best_time_to_contact"
										placeholder="Select time..."
										size="large"
										class="w-full"
									>
										<el-option label="Morning" value="Morning" />
										<el-option label="Afternoon" value="Afternoon" />
										<el-option label="Evening" value="Evening" />
									</el-select>
									<div v-if="errors.best_time_to_contact" class="text-red-500 text-xs mt-1">
										{{ errors.best_time_to_contact }}
									</div>
								</div>

								<div :ref="(el) => setItemRef(el, 'sub_prime_department')">
									<label class="block text-sm font-bold text-slate-700 mb-1"
										>Sub-prime Department?</label
									>
									<el-select
										v-model="form.sub_prime_department"
										placeholder="Select..."
										size="large"
										class="w-full"
									>
										<el-option label="Yes" value="Yes" />
										<el-option label="No" value="No" />
										<el-option label="Not sure" value="Not sure" />
									</el-select>
									<div v-if="errors.sub_prime_department" class="text-red-500 text-xs mt-1">
										{{ errors.sub_prime_department }}
									</div>
								</div>

								<div class="md:col-span-2" :ref="(el) => setItemRef(el, 'website')">
									<label class="block text-sm font-bold text-slate-700 mb-1">Website</label>
									<el-input v-model="form.website" placeholder="https://www.example.com" size="large">
										<template #prepend>https://</template>
									</el-input>
									<div v-if="errors.website" class="text-red-500 text-xs mt-1">
										{{ errors.website }}
									</div>
								</div>

								<div class="md:col-span-2" :ref="(el) => setItemRef(el, 'note')">
									<label class="block text-sm font-bold text-slate-700 mb-1"
										>Additional Notes (Optional)</label
									>
									<el-input
										v-model="form.note"
										type="textarea"
										:rows="4"
										placeholder="Any specific questions or details..."
									/>
									<div v-if="errors.note" class="text-red-500 text-xs mt-1">{{ errors.note }}</div>
								</div>
							</div>
						</div>

						<div class="pt-6 flex flex-col-reverse md:flex-row justify-end gap-4">
							<el-button size="large" @click="store.resetView" class="w-full md:w-auto">Cancel</el-button>
							<el-button
								type="primary"
								size="large"
								native-type="submit"
								class="!px-8 !font-bold w-full md:w-auto"
							>
								Submit Inquiry <i class="fas fa-paper-plane ml-2"></i>
							</el-button>
						</div>
					</form>
				</el-card>
			</div>
		</div>
	</div>
</template>
