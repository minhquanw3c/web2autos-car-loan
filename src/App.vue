<script setup lang="ts">
	import { ref, onMounted, watch } from 'vue'
	import { useLoanStore } from '@/stores/loan'
	import LoanInputSection from '@/components/LoanInputSection.vue'
	import LoanSummary from '@/components/LoanSummary.vue'
	import VehicleGrid from '@/components/VehicleGrid.vue'
	import VehicleModal from '@/components/VehicleModal.vue'
	import ConsultantForm from '@/components/ConsultantForm.vue'
	import VehicleFilters from '@/components/VehicleFilters.vue'

	const store = useLoanStore()
	const showMobileLoanCalc = ref(false)
	const showMobileVehFilters = ref(false)

	onMounted(() => {
		store.fetchInventory()
	})
</script>

<template>
	<div class="app-layout">
		<div class="bg-layer">
			<div class="orb orb-1"></div>
			<div class="orb orb-2"></div>
		</div>

		<!-- HEADER -->
		<header class="header-glass sticky top-0 z-40 border-b border-white/10">
			<div class="max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
				<div class="flex items-center gap-3 cursor-pointer group" @click="store.resetView">
					<a href="https://web2autos.com" target="_blank">
						<img
							src="/logo.png"
							alt="Web2Autos Logo"
							class="h-16 w-auto object-contain transform transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
						/>
					</a>
				</div>

				<div class="flex items-center gap-4">
					<div class="flex flex-col items-end mr-2">
						<span class="text-[10px] text-gray-400 uppercase font-bold">Sales Hotline</span>
						<span
							class="text-white tracking-wide text-sm hover:text-indigo-400 transition-colors cursor-pointer"
						>
							<i class="fas fa-phone-alt mr-1 text-xs"></i> (844) 922-7227
						</span>
					</div>
				</div>
			</div>
		</header>

		<!-- MAIN CONTENT -->
		<main class="flex-grow w-full max-w-[1900px] mx-auto relative z-10 p-4 sm:p-6 lg:p-8">
			<transition name="fade" mode="out-in">
				<!-- CALCULATOR VIEW -->
				<div v-if="store.currentView === 'calculator'" key="calc">
					<!-- 3-COLUMN LAYOUT WRAPPER -->
					<div class="flex flex-col lg:flex-row gap-6 items-start">
						<!-- COL 1: VEHICLE FILTERS (Left Sidebar - Desktop XL only) -->
						<!-- Sticky positioning ensures it stays in view while scrolling the grid -->
						<aside class="hidden xl:block w-[280px] flex-shrink-0 sticky top-24">
							<VehicleFilters />
						</aside>

						<!-- COL 2: VEHICLES (Middle Content) -->
						<div class="w-full flex-1 order-1 lg:order-1 pb-32 lg:pb-0 min-w-0">
							<VehicleGrid />
						</div>

						<!-- COL 3: LOAN CALCULATOR (Right Sidebar) -->
						<aside
							class="sidebar-container w-full lg:w-[380px] xl:w-[400px] flex-shrink-0 order-2 lg:order-2"
						>
							<!-- Mobile/Tablet Sheet: LOAN CALCULATOR -->
							<div
								class="mobile-bottom-sheet fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl lg:bg-transparent lg:backdrop-blur-none shadow-[0_-8px_30px_rgba(0,0,0,0.15)] lg:shadow-none rounded-t-3xl lg:rounded-none border-t border-white/50 lg:border-none p-4 lg:p-0 transition-transform duration-300 ease-in-out max-h-[85vh] overflow-y-auto lg:max-h-none lg:overflow-visible lg:sticky lg:top-24 lg:transform-none"
								:class="showMobileLoanCalc ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'"
							>
								<div
									class="w-16 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 lg:hidden cursor-pointer"
									@click="showMobileLoanCalc = false"
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

									<button
										@click="showMobileLoanCalc = false"
										class="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl lg:hidden mt-4 hover:bg-gray-200 transition-colors"
									>
										Close
									</button>
								</div>
							</div>
						</aside>
					</div>

					<VehicleModal />

					<!-- MOBILE FLOATING BUTTONS -->
					<!-- Visible on Mobile (<lg) AND Tablet (<xl) since Filters are hidden on Tablet -->
					<div class="fixed bottom-6 left-0 right-0 z-[60] xl:hidden px-4 flex gap-3 justify-center">
						<!-- 1. Toggle Vehicle Filters -->
						<button
							@click="showMobileVehFilters = !showMobileVehFilters"
							class="flex-1 bg-slate-800 text-white px-4 py-3 rounded-full shadow-2xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95 border border-white/20"
						>
							<i class="fas fa-filter"></i>
							<span class="font-bold text-sm">Filters</span>
						</button>

						<!-- 2. Toggle Loan Calc (Only on mobile <lg, visible on sidebar for lg+) -->
						<button
							@click="showMobileLoanCalc = !showMobileLoanCalc"
							class="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-full shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95 border border-white/20 lg:hidden"
						>
							<i class="fas fa-calculator"></i>
							<span class="font-bold text-sm">Loan Calc</span>
						</button>
					</div>

					<!-- Mobile Sheet: VEHICLE FILTERS -->
					<div
						class="mobile-bottom-sheet fixed bottom-0 left-0 right-0 z-[70] bg-white/95 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.25)] rounded-t-3xl border-t border-white/50 p-4 transition-transform duration-300 ease-in-out max-h-[85vh] overflow-y-auto xl:hidden"
						:class="showMobileVehFilters ? 'translate-y-0' : 'translate-y-full'"
					>
						<div
							class="w-16 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 cursor-pointer"
							@click="showMobileVehFilters = false"
						></div>

						<VehicleFilters />

						<button
							@click="showMobileVehFilters = false"
							class="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl mt-4 hover:bg-indigo-700 transition-colors"
						>
							View Results ({{ store.filteredVehicles.length }})
						</button>
					</div>
				</div>

				<div v-else-if="store.currentView === 'application'" key="app">
					<ConsultantForm />
				</div>
			</transition>
		</main>

		<!-- FOOTER -->
		<footer
			class="relative z-20 border-t border-white/10 bg-slate-900/60 backdrop-blur-xl text-slate-400 text-sm mb-16 xl:mb-0"
		>
			<div class="max-w-[1800px] mx-auto px-4 py-12">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					<!-- Brand -->
					<div class="col-span-1 md:col-span-1">
						<div class="flex items-center gap-2 mb-4 text-white">
							<a href="https://web2autos.com" target="_blank">
								<img src="/logo.png" alt="Web2Autos" class="h-16 w-auto object-contain" />
							</a>
						</div>
						<p class="leading-relaxed mb-4">
							Get approved for your next car fast with Web2Autos. We connect you to trusted dealers work
							with all credit types. Apply online in minutes!
						</p>
					</div>

					<!-- Legal -->
					<div>
						<h4 class="text-white font-bold mb-4 uppercase text-xs tracking-wider">Legal</h4>
						<ul class="space-y-2">
							<li>
								<a
									href="https://web2autos.com/disclaimer/"
									target="_blank"
									class="hover:text-indigo-400 transition-colors"
									>Disclaimer</a
								>
							</li>
							<li>
								<a
									href="https://web2autos.com/__trashed/"
									target="_blank"
									class="hover:text-indigo-400 transition-colors"
									>Terms of Service</a
								>
							</li>
						</ul>
					</div>

					<!-- Social -->
					<div>
						<h4 class="text-white font-bold mb-4 uppercase text-xs tracking-wider">Social</h4>
						<ul class="space-y-2">
							<li>
								<a
									href="https://www.facebook.com/profile.php?id=61580498513700"
									target="_blank"
									class="w-8 h-8 rounded bg-white/5 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
									><i class="fab fa-facebook-f"></i
								></a>
							</li>
							<li>
								<a
									href="https://www.tiktok.com/@web2autos"
									target="_blank"
									class="w-8 h-8 rounded bg-white/5 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors"
									><i class="fab fa-tiktok"></i
								></a>
							</li>
						</ul>
					</div>

					<!-- Contact -->
					<div>
						<h4 class="text-white font-bold mb-4 uppercase text-xs tracking-wider">Contact</h4>
						<ul class="space-y-3">
							<li class="flex items-start gap-3">
								<i class="fas fa-map-marker-alt mt-1 text-indigo-500"></i>
								<span>38623 FREMONT BLVD STE 185,<br />FREMONT, CA 94536</span>
							</li>
							<li class="flex items-center gap-3">
								<i class="fas fa-phone text-indigo-500"></i>
								<span>Direct: (408) 646-1313 (24/7)</span>
							</li>
							<li class="flex items-center gap-3">
								<i class="fas fa-phone text-indigo-500"></i>
								<span>Office: (844) 922-7227</span>
							</li>
							<li class="flex items-center gap-3">
								<i class="fas fa-envelope text-indigo-500"></i>
								<span>info@web2autos.com</span>
							</li>
						</ul>
					</div>
				</div>

				<div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
					<p>&copy; {{ new Date().getFullYear() }} Web2Autos Inc. All rights reserved.</p>
				</div>
			</div>
		</footer>
	</div>
</template>

<style scoped>
	.app-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.header-glass {
		background: rgba(15, 23, 42, 0.6);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.mobile-bottom-sheet::-webkit-scrollbar {
		width: 6px;
	}

	.mobile-bottom-sheet::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 3px;
	}

	.safe-area-bottom {
		padding-bottom: env(safe-area-inset-bottom);
		height: calc(4rem + env(safe-area-inset-bottom));
	}

	@media (min-width: 1024px) {
		.app-container {
			padding: 2rem;
		}
	}
</style>
