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
	<div class="app-layout">
		<!-- Background Animation Layer -->
		<div class="bg-layer">
			<div class="orb orb-1"></div>
			<div class="orb orb-2"></div>
		</div>

		<!-- HEADER -->
		<header class="header-glass sticky top-0 z-40 border-b border-white/10">
			<div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
				<!-- Logo Area (Updated to PNG) -->
				<div class="flex items-center gap-3 cursor-pointer group" @click="store.resetView">
					<a href="https://web2autos.com" target="_blank">
						<img
							src="/logo.png"
							alt="Web2Autos Logo"
							class="h-16 w-auto object-contain transform transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
						/>
					</a>
				</div>

				<!-- CTA / Phone -->
				<div class="flex items-center gap-4">
					<div class="flex flex-col items-end mr-2">
						<span class="text-[10px] text-gray-400 uppercase font-bold">Sales Hotline</span>
						<span
							class="text-white font-bold tracking-wide text-sm hover:text-indigo-400 transition-colors cursor-pointer"
						>
							<i class="fas fa-phone-alt mr-1 text-xs"></i> (844) 922-7227
						</span>
					</div>
					<!-- Hamburger removed in favor of Bottom Nav on mobile -->
				</div>
			</div>
		</header>

		<!-- MAIN CONTENT -->
		<main class="flex-grow w-full max-w-[1800px] mx-auto relative z-10 p-4 sm:p-6 lg:p-8">
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
							<div
								class="mobile-bottom-sheet fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl lg:bg-transparent lg:backdrop-blur-none shadow-[0_-8px_30px_rgba(0,0,0,0.15)] lg:shadow-none rounded-t-3xl lg:rounded-none border-t border-white/50 lg:border-none p-4 lg:p-0 transition-transform duration-300 ease-in-out max-h-[85vh] overflow-y-auto lg:max-h-none lg:overflow-visible lg:sticky lg:top-24 lg:transform-none"
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

									<!-- Mobile Close Button -->
									<button
										@click="showMobileFilters = false"
										class="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl lg:hidden mt-4 hover:bg-gray-200 transition-colors"
									>
										Close Filters
									</button>
								</div>
							</div>
						</div>
					</div>

					<VehicleModal />

					<!-- Mobile Filter Toggle FAB -->
					<button
						@click="showMobileFilters = !showMobileFilters"
						class="fixed transform z-40 lg:hidden bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-95 border border-white/20"
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
			<!-- Positioned higher (160px) on mobile to sit above your Filter button -->
			<el-backtop
				:right="20"
				:bottom="160"
				class="!bg-indigo-600 !text-white !shadow-xl hover:!bg-indigo-700 transition-colors !w-12 !h-12 lg:!bottom-10 lg:!right-10 !z-30"
			>
				<i class="fas fa-arrow-up font-bold text-lg"></i>
			</el-backtop>
		</main>

		<!-- FOOTER -->
		<footer
			class="relative z-20 border-t border-white/10 bg-slate-900/60 backdrop-blur-xl text-slate-400 text-sm md:mb-0"
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

				<div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
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

	/* Glass Header Background */
	.header-glass {
		background: rgba(15, 23, 42, 0.6); /* Slate-900 with opacity */
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	/* Custom Scrollbar for the mobile sheet */
	.mobile-bottom-sheet::-webkit-scrollbar {
		width: 6px;
	}

	.mobile-bottom-sheet::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 3px;
	}

	/* Ensure bottom nav accounts for safe area on iPhone X+ */
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
