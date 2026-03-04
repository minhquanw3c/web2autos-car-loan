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
				<p class="text-blue-200 text-lg max-w-2xl mx-auto">Check out some of our latest arrivals.</p>
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

		<CustomerReviews />
		<VideoPlayer />
		<StepsSection />
	</div>
</template>
