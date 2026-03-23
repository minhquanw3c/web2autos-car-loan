<script setup lang="ts">
	import { computed } from 'vue'
	import { useLoanStore } from '@/stores/loan'
	import { ElMessage } from 'element-plus'
	import BannerSlider from '@/components/BannerSlider.vue'
	import LendingPartners from '@/components/LendingPartners.vue'
	import CustomerReviews from '@/components/CustomerReviews.vue'
	import VideoPlayer from '@/components/VideoPlayer.vue'
	import StepsSection from '@/components/StepsSection.vue'
	import type { Vehicle } from '@/types'

	const store = useLoanStore()

	const sampleVehicles = computed(() => {
		return store.inventory.slice(0, 8)
	})

	const formatCurrency = (val: number) => {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
			val
		)
	}

	const copyLink = (vehicle: Vehicle) => {
		const url = `${window.location.origin}${window.location.pathname}?vehicle_id=${vehicle.id}`
		navigator.clipboard
			.writeText(url)
			.then(() => {
				ElMessage({
					message: 'Vehicle link copied to clipboard!',
					type: 'success',
					duration: 2000
				})
			})
			.catch(() => {
				ElMessage.error('Failed to copy link')
			})
	}

	const viewVehicle = (vehicle: Vehicle) => {
		store.selectedVehicle = vehicle
		const url = new URL(window.location.href)
		url.searchParams.set('vehicle_id', vehicle.id)
		url.searchParams.set('showInventory', 'true')
		window.history.pushState({}, '', url.toString())
		store.goToInventory()
	}
</script>

<template>
	<div class="animate-[fadeIn_0.5s_ease-out]">
		<BannerSlider />
		<LendingPartners />

		<!-- Featured Vehicles Section -->
		<div class="mb-24" v-if="sampleVehicles.length > 0">
			<div class="text-center mb-12">
				<h2 class="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">Featured Inventory</h2>
				<p class="text-blue-200 text-lg max-w-2xl mx-auto">Check out some of our new arrivals.</p>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
				<el-card
					v-for="car in sampleVehicles"
					:key="car.id"
					:body-style="{ padding: '0px' }"
					shadow="hover"
					class="vehicle-card h-full flex flex-col cursor-pointer"
					@click="viewVehicle(car)"
				>
					<div class="relative h-48 overflow-hidden bg-gray-100">
						<img
							:src="car.mediaUrls.length ? car.mediaUrls[0] : ''"
							alt="Car"
							loading="lazy"
							class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
						/>
						<div
							class="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-blue-600 shadow-sm"
						>
							{{ car.year }}
						</div>
						<div
							style="top: 0.5rem; right: 3.5rem"
							class="absolute bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-blue-600 shadow-sm"
						>
							{{ car.inventory_type.toLocaleUpperCase() }}
						</div>
					</div>
					<div class="p-5 flex flex-col flex-grow">
						<div class="flex flex-col items-start mb-2">
							<h4 class="text-lg text-gray-800 leading-tight">{{ car.dealer.name }}</h4>
							<h4 class="font-bold text-lg text-gray-800 leading-tight">{{ car.heading }}</h4>
						</div>

						<div class="flex items-baseline gap-2 mb-2">
							<span class="text-xl font-extrabold text-blue-600">{{ formatCurrency(car.price) }}</span>
							<span class="text-xs text-gray-400 font-semibold" v-if="store.filterMode === 'budget'">
								(~{{ formatCurrency(store.calculatePaymentForPrice(car.price)) }}/mo)
							</span>
						</div>

						<div class="mt-auto pt-2 flex gap-2">
							<el-button type="primary" plain class="flex-1"> View Details </el-button>
							<el-button @click.stop="copyLink(car)" type="success" plain class="!px-3" title="Copy Link">
								<i class="fas fa-link mr-1"></i> Copy Link
							</el-button>
						</div>
					</div>
				</el-card>
			</div>

			<div class="text-center">
				<button
					@click="store.goToInventory"
					class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95"
				>
					View Full Inventory <i class="fas fa-arrow-right"></i>
				</button>
			</div>
		</div>

		<div v-else-if="store.isFetchingVehicles" class="mb-24 text-center py-12">
			<div
				class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
			></div>
			<p class="text-slate-400">Loading featured vehicles...</p>
		</div>

		<!-- Why Web2Autos Works Section -->
		<div class="mb-24 mx-4 md:mx-0">
			<div
				class="bg-white rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden flex flex-col-reverse lg:flex-row-reverse"
			>
				<!-- Background decoration -->
				<div
					class="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"
				></div>
				<div
					class="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"
				></div>

				<div class="flex-1 space-y-6 p-8 md:p-12 relative z-10">
					<h2 class="text-3xl md:text-4xl font-bold text-slate-900 drop-shadow-sm">Why Web2Autos Works</h2>

					<div class="text-slate-700 text-lg space-y-4 leading-relaxed">
						<p>
							At Web2Autos, we help individuals with challenged credit connect with dealerships that are
							ready to give them a real opportunity — with dignity, speed, and professionalism.
						</p>
						<p>While many services stop after collecting your application, we go further.</p>
						<p>
							With over 25 years of experience in auto finance, our founder Danny Tran and the Web2Autos
							team understand the realities of buying a car with credit challenges. We don’t just pass
							your info around. We carefully match you with a participating dealership that actually
							understands your situation and is open to working with you.
						</p>
						<p class="text-sm text-slate-500 italic pt-4">
							Web2Autos is not a lender, broker, or dealership. We don’t make credit decisions — we simply
							connect you with the people who can help.
						</p>
					</div>

					<div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mt-8">
						<h3 class="text-xl font-bold text-indigo-900 mb-4">
							Here’s what you can expect when you apply:
						</h3>
						<ul class="space-y-4">
							<li class="flex items-start gap-4">
								<i class="fas fa-check-circle text-indigo-600 text-xl mt-1 shrink-0"></i>
								<span class="text-slate-800"
									>A personalized match with a dealership that welcomes all credit types</span
								>
							</li>
							<li class="flex items-start gap-4">
								<i class="fas fa-check-circle text-indigo-600 text-xl mt-1 shrink-0"></i>
								<span class="text-slate-800"
									>Financing possibilities — even after repos, bankruptcies, or limited credit
									history</span
								>
							</li>
							<li class="flex items-start gap-4">
								<i class="fas fa-check-circle text-indigo-600 text-xl mt-1 shrink-0"></i>
								<span class="text-slate-800">Options that may include affordable monthly payments</span>
							</li>
							<li class="flex items-start gap-4">
								<i class="fas fa-check-circle text-indigo-600 text-xl mt-1 shrink-0"></i>
								<span class="text-slate-800">The possibility of $0 down and quick delivery</span>
							</li>
							<li class="flex items-start gap-4">
								<i class="fas fa-check-circle text-indigo-600 text-xl mt-1 shrink-0"></i>
								<span class="text-slate-800">One-on-one support from professionals who truly care</span>
							</li>
							<li class="flex items-start gap-4">
								<i class="fas fa-check-circle text-indigo-600 text-xl mt-1 shrink-0"></i>
								<span class="text-slate-800"
									>A smooth, respectful process from application to dealership introduction</span
								>
							</li>
						</ul>
					</div>

					<div class="pt-6 border-t border-gray-100 mt-6">
						<button
							@click="store.startApplication"
							class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg w-full sm:w-auto"
						>
							Apply Now <i class="fas fa-arrow-right"></i>
						</button>
					</div>
				</div>

				<div class="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-full">
					<img
						src="/ildar-garifullin-TX2tgF4aFhI-unsplash.jpg"
						alt="Why Web2Autos Works"
						class="absolute inset-0 w-full h-full object-cover"
						loading="lazy"
					/>
				</div>
			</div>
		</div>

		<CustomerReviews />
		<VideoPlayer />
		<StepsSection />
	</div>
</template>
