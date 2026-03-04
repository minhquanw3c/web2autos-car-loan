<script setup lang="ts">
	import { ref, watch } from 'vue'
	import { useLoanStore } from '@/stores/loan'
	import VehicleGrid from '@/components/VehicleGrid.vue'
	import VehicleModal from '@/components/VehicleModal.vue'
	import VehicleFilters from '@/components/VehicleFilters.vue'
	import LoanInputSection from '@/components/LoanInputSection.vue'
	import LoanSummary from '@/components/LoanSummary.vue'

	const store = useLoanStore()
	const showMobileVehFilters = ref(false)
	const showFiltersButton = ref(false)
	const vehicleGridRef = ref<HTMLElement | null>(null)
	let observer: IntersectionObserver | null = null

	watch(vehicleGridRef, (el) => {
		if (observer) {
			observer.disconnect()
			observer = null
		}
		if (el) {
			observer = new IntersectionObserver(
				([entry]) => {
					if (entry) {
						showFiltersButton.value = entry.isIntersecting
					}
				},
				{ threshold: 0 }
			)
			observer.observe(el)
		}
	})

	const closeMobileModals = () => {
		showMobileVehFilters.value = false
	}
</script>

<template>
	<div class="animate-[fadeIn_0.5s_ease-out]">
		<div class="mb-10">
			<div
				class="bg-slate-900/95 backdrop-blur-md rounded-xl shadow-xl border border-white/10 overflow-hidden p-6"
			>
				<div class="flex flex-col lg:flex-row gap-6">
					<div class="w-full lg:w-1/3 xl:w-1/4">
						<LoanSummary />
					</div>
					<div class="w-full lg:w-2/3 xl:w-3/4">
						<LoanInputSection />
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-col lg:flex-row gap-6 items-start">
			<aside
				class="hidden xl:block w-[280px] flex-shrink-0 sticky top-24 h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar rounded-xl"
			>
				<VehicleFilters />
			</aside>

			<div class="w-full flex-1 pb-32 lg:pb-0 min-w-0" ref="vehicleGridRef">
				<VehicleGrid />
			</div>
		</div>

		<VehicleModal />

		<div
			v-if="!showMobileVehFilters && showFiltersButton"
			class="fixed bottom-6 left-0 right-0 z-[60] xl:hidden px-4 flex gap-3 justify-center"
		>
			<button
				@click="showMobileVehFilters = true"
				class="bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95 border border-white/20"
			>
				<i class="fas fa-filter"></i>
				<span class="font-bold text-sm">Filters</span>
			</button>
		</div>

		<div
			v-else-if="showMobileVehFilters"
			class="fixed bottom-6 left-0 right-0 z-[80] px-4 flex justify-center animate-[fadeIn_0.3s_ease-out]"
		>
			<button
				@click="closeMobileModals"
				class="w-full max-w-sm bg-slate-900 text-white px-6 py-3 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95 border border-white/20"
			>
				<i class="fas fa-times text-lg"></i>
				<span class="font-bold text-sm">Close</span>
			</button>
		</div>

		<div
			class="mobile-bottom-sheet fixed bottom-0 left-0 right-0 z-[70] bg-white/95 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.25)] rounded-t-3xl border-t border-white/50 p-4 transition-transform duration-300 ease-in-out max-h-[85vh] overflow-y-auto xl:hidden"
			:class="showMobileVehFilters ? 'translate-y-0' : 'translate-y-full'"
		>
			<VehicleFilters />
			<div class="h-16"></div>
		</div>
	</div>
</template>
