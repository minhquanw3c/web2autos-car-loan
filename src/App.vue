<script setup lang="ts">
	import { ref, onMounted, watch } from 'vue'
	import { useLoanStore } from '@/stores/loan'
	import LoanInputSection from '@/components/LoanInputSection.vue'
	import LoanSummary from '@/components/LoanSummary.vue'
	import VehicleGrid from '@/components/VehicleGrid.vue'
	import VehicleModal from '@/components/VehicleModal.vue'
	import ConsultantForm from '@/components/ConsultantForm.vue'

	const store = useLoanStore()
	const showMobileFilters = ref(false) // Controls mobile sheet visibility

	// Trigger the initial fetch for the "1000 rows" when the app mounts
	onMounted(() => {
		store.fetchInventory()
	})
</script>

<template>
	<div class="app-container">
		<!-- Background Animation Layer -->
		<div class="bg-layer">
			<div class="orb orb-1"></div>
			<div class="orb orb-2"></div>
		</div>

		<div class="max-w-[1800px] mx-auto relative z-10">
			<transition name="fade" mode="out-in">
				<!-- CALCULATOR VIEW -->
				<div v-if="store.currentView === 'calculator'" key="calc">
					<div class="flex flex-col lg:flex-row gap-6 items-start">
						<!-- LEFT COLUMN: VEHICLES (Main Content) -->
						<div class="w-full lg:flex-1 order-1 lg:order-1 lg:pb-0 min-w-0">
							<VehicleGrid />
						</div>

						<!-- RIGHT COLUMN: FILTERS & SUMMARY (Sidebar) -->
						<div
							class="sidebar-container w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 order-2 lg:order-2"
						>
							<!-- 
                  Mobile: Fixed Bottom Sheet (Hidden by default)
                  Desktop: Static / Sticky
              -->
							<div
								class="mobile-bottom-sheet fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl lg:bg-transparent lg:backdrop-blur-none shadow-[0_-8px_30px_rgba(0,0,0,0.15)] lg:shadow-none rounded-t-3xl lg:rounded-none border-t border-white/50 lg:border-none p-4 lg:p-0 transition-transform duration-300 ease-in-out max-h-[85vh] overflow-y-auto lg:max-h-none lg:overflow-visible lg:sticky lg:top-6 lg:transform-none"
								:class="showMobileFilters ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'"
							>
								<!-- Mobile Drag Handle / Close -->
								<div
									class="w-16 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 lg:hidden cursor-pointer"
									@click="showMobileFilters = false"
								></div>

								<div class="space-y-6">
									<LoanSummary />

									<div class="filter-scroll-area">
										<LoanInputSection />
									</div>

									<el-alert
										title="Tip"
										type="info"
										description="Click on any vehicle to view details and apply."
										show-icon
										:closable="false"
										class="hidden lg:flex"
									/>
								</div>
							</div>
						</div>
					</div>

					<VehicleModal />

					<!-- Mobile Filter Toggle FAB -->
					<button
						@click="showMobileFilters = !showMobileFilters"
						class="fixed transform z-50 lg:hidden bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-95 border border-white/20"
						style="bottom: 6rem; right: 1rem"
					>
						<i class="fas" :class="showMobileFilters ? 'fa-times' : 'fa-sliders-h'"></i>
						<span class="font-bold text-sm tracking-wide">{{
							showMobileFilters ? 'Close' : 'Filters'
						}}</span>
					</button>
				</div>

				<!-- APPLICATION VIEW -->
				<div v-else-if="store.currentView === 'application'" key="app">
					<ConsultantForm />
				</div>
			</transition>

			<!-- Scroll To Top Button -->
			<!-- Positioned higher (160px) on mobile to sit above your Filter button (which is at ~96px) -->
			<el-backtop
				:right="20"
				:bottom="160"
				class="!bg-indigo-600 !text-white !shadow-xl hover:!bg-indigo-700 transition-colors !w-12 !h-12 lg:!bottom-10 lg:!right-10 !z-40"
			>
				<i class="fas fa-arrow-up font-bold text-lg"></i>
			</el-backtop>
		</div>
	</div>
</template>

<style scoped>
	.app-container {
		padding: 1rem;
		min-height: 100vh;
	}

	/* Custom Scrollbar for the mobile sheet */
	.mobile-bottom-sheet::-webkit-scrollbar {
		width: 6px;
	}

	.mobile-bottom-sheet::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 3px;
	}

	@media (min-width: 1024px) {
		.app-container {
			padding: 2rem;
		}
	}
</style>
