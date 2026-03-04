<script setup lang="ts">
	import { computed } from 'vue'
	import { useLoanStore } from '@/stores/loan'
	import BannerSlider from '@/components/BannerSlider.vue'
	import LendingPartners from '@/components/LendingPartners.vue'
	import CustomerReviews from '@/components/CustomerReviews.vue'
	import VideoPlayer from '@/components/VideoPlayer.vue'
	import StepsSection from '@/components/StepsSection.vue'
	import type { Vehicle } from '@/types'

	const store = useLoanStore()

	// Get a limited sample of vehicles (e.g., first 4)
	const sampleVehicles = computed(() => {
		return store.inventory.slice(0, 4)
	})

	const formatCurrency = (val: number) => {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
			val
		)
	}

	const viewVehicle = (vehicle: Vehicle) => {
		store.selectedVehicle = vehicle
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
				<div
					v-for="car in sampleVehicles"
					:key="car.id"
					class="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-700 group cursor-pointer flex flex-col"
					@click="viewVehicle(car)"
				>
					<div class="relative h-48 overflow-hidden bg-gray-100">
						<img
							:src="car.mediaUrls.length ? car.mediaUrls[0] : ''"
							alt="Car"
							loading="lazy"
							class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
						/>
						<div
							class="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-blue-600 shadow-sm"
						>
							{{ car.year }}
						</div>
					</div>
					<div class="p-4 flex flex-col flex-grow">
						<h4 class="font-bold text-lg text-white leading-tight mb-1">{{ car.make }} {{ car.model }}</h4>
						<p class="text-sm text-slate-400 mb-3">{{ car.trim }}</p>
						<div class="mt-auto flex items-center justify-between">
							<span class="text-xl font-extrabold text-indigo-400">{{ formatCurrency(car.price) }}</span>
							<span class="text-xs text-slate-400">{{ car.miles.toLocaleString() }} mi</span>
						</div>
					</div>
				</div>
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
