<script setup lang="ts">
	import { onMounted } from 'vue'
	import { useLoanStore } from '@/stores/loan'
	import HomePage from '@/components/HomePage.vue'
	import InventoryPage from '@/components/InventoryPage.vue'
	import ConsultantForm from '@/components/ConsultantForm.vue'
	import StepsSection from '@/components/StepsSection.vue'
	import ContactPage from '@/components/ContactPage.vue'
	import PrivacyPage from '@/components/PrivacyPage.vue'
	import TermsPage from '@/components/TermsPage.vue'
	import DisclaimerPage from '@/components/DisclaimerPage.vue'
	import DealershipInquiryPage from '@/components/DealershipInquiryPage.vue'
	import FullScreenLoader from '@/components/FullScreenLoader.vue'

	const store = useLoanStore()

	onMounted(() => {
		store.fetchInventory()

		// Check URL for direct application access
		const urlParams = new URLSearchParams(window.location.search)
		if (urlParams.get('showApplication') === 'true') {
			store.startApplication()
		} else if (urlParams.get('showContact') === 'true') {
			store.goToContact()
		} else if (urlParams.get('showPrivacy') === 'true') {
			store.goToPrivacy()
		} else if (urlParams.get('showTerms') === 'true') {
			store.goToTerms()
		} else if (urlParams.get('showDisclaimer') === 'true') {
			store.goToDisclaimer()
		} else if (urlParams.get('showInventory') === 'true' || urlParams.get('vehicle_id')) {
			store.goToInventory()
		} else if (urlParams.get('showDealershipInquiry') === 'true') {
			store.goToDealershipInquiry()
		}
	})
</script>

<template>
	<div class="app-layout bg-slate-900 transition-colors duration-300">
		<FullScreenLoader
			:visible="store.isFetchingVehicles && store.inventory.length === 0 && store.currentView !== 'onboarding'"
			:text="store.loadingMessage"
		/>

		<!-- Mobile Navigation Menu -->
		<div
			class="fixed right-0 top-1/2 -translate-y-1/2 z-[3000] flex flex-col gap-4 p-3 bg-slate-900/90 backdrop-blur-lg rounded-l-2xl border-y border-l border-white/20 shadow-2xl lg:hidden"
		>
			<button
				@click="store.resetView"
				class="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg border border-indigo-500/30"
				title="Home"
			>
				<i class="fas fa-home"></i>
			</button>
			<button
				@click="store.goToInventory"
				class="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg border border-indigo-500/30"
				title="Inventory"
			>
				<i class="fas fa-car"></i>
			</button>
			<button
				@click="store.goToContact"
				class="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg border border-indigo-500/30"
				title="Contact"
			>
				<i class="fas fa-envelope"></i>
			</button>
			<button
				@click="store.goToDealershipInquiry"
				class="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg border border-indigo-500/30"
				title="For Dealers"
			>
				<i class="fas fa-handshake"></i>
			</button>
		</div>

		<div class="bg-layer">
			<div class="orb orb-1 opacity-100"></div>
			<div class="orb orb-2 opacity-100"></div>
		</div>

		<header class="header-glass sticky top-0 z-40 border-b border-white/10">
			<div class="max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
				<div class="flex items-center gap-3 cursor-pointer group" @click="store.resetView">
					<div class="relative overflow-hidden rounded-lg">
						<img
							src="/logo_01.png"
							alt="Web2Autos Logo"
							class="h-16 w-auto object-contain transform transition-transform duration-300 group-hover:scale-105 drop-shadow-md relative z-10"
						/>
						<div class="logo-shine"></div>
					</div>
				</div>

				<div class="flex items-center gap-6">
					<nav class="hidden lg:flex items-center gap-6 mr-4">
						<a
							@click="store.resetView"
							:class="
								store.currentView === 'home'
									? 'text-white font-bold'
									: 'text-slate-300 hover:text-white'
							"
							class="cursor-pointer transition-colors text-sm uppercase tracking-wide"
							>Home</a
						>
						<a
							@click="store.goToInventory"
							:class="
								store.currentView === 'inventory'
									? 'text-white font-bold'
									: 'text-slate-300 hover:text-white'
							"
							class="cursor-pointer transition-colors text-sm uppercase tracking-wide"
							>Inventory</a
						>
						<a
							@click="store.goToContact"
							:class="
								store.currentView === 'contact'
									? 'text-white font-bold'
									: 'text-slate-300 hover:text-white'
							"
							class="cursor-pointer transition-colors text-sm uppercase tracking-wide"
							>Contact</a
						>
						<a
							@click="store.goToDealershipInquiry"
							:class="
								store.currentView === 'dealership-inquiry'
									? 'text-white font-bold'
									: 'text-slate-300 hover:text-white'
							"
							class="cursor-pointer transition-colors text-sm uppercase tracking-wide"
							>For Dealers</a
						>
					</nav>

					<button
						v-if="store.currentView !== 'application'"
						@click="store.startApplication()"
						class="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
					>
						<i class="fas fa-file-signature"></i> Apply for Financing
					</button>

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

		<main class="flex-grow w-full max-w-[1900px] mx-auto relative z-10 p-4 sm:p-6 lg:p-8">
			<transition name="fade" mode="out-in">
				<div v-if="store.currentView === 'home'" key="home">
					<HomePage />
				</div>

				<div v-else-if="store.currentView === 'inventory'" key="inventory">
					<InventoryPage />
				</div>

				<div v-else-if="store.currentView === 'application'" key="app">
					<ConsultantForm />
				</div>

				<div v-else-if="store.currentView === 'contact'" key="contact">
					<ContactPage />
				</div>

				<div v-else-if="store.currentView === 'privacy'" key="privacy">
					<PrivacyPage />
				</div>

				<div v-else-if="store.currentView === 'terms'" key="terms">
					<TermsPage />
				</div>

				<div v-else-if="store.currentView === 'disclaimer'" key="disclaimer">
					<DisclaimerPage />
				</div>

				<div v-else-if="store.currentView === 'dealership-inquiry'" key="dealership-inquiry">
					<DealershipInquiryPage />
				</div>
			</transition>
		</main>

		<footer
			class="relative z-20 border-t border-white/10 bg-slate-900/60 backdrop-blur-xl text-slate-400 text-sm xl:mb-0 transition-colors duration-300"
		>
			<div class="max-w-[1800px] mx-auto px-4 py-12">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					<div class="col-span-1 md:col-span-1">
						<div class="flex items-center gap-2 mb-4 text-white cursor-pointer" @click="store.resetView">
							<div class="relative overflow-hidden rounded-lg group">
								<img
									src="/logo_01.png"
									alt="Web2Autos"
									class="h-16 w-auto object-contain relative z-10 transform transition-transform duration-300 group-hover:scale-105"
								/>
								<div class="logo-shine"></div>
							</div>
						</div>
						<p class="leading-relaxed mb-4">
							Get approved for your next car fast with Web2Autos. We connect you to trusted dealers work
							with all credit types. Apply online in minutes!
						</p>
					</div>

					<div>
						<h4 class="text-white font-bold mb-4 uppercase text-xs tracking-wider">Company</h4>
						<ul class="space-y-2 mb-4">
							<li>
								<a
									@click="store.resetView"
									class="cursor-pointer hover:text-indigo-400 transition-colors"
									>Home</a
								>
							</li>
							<li>
								<a
									@click="store.goToContact"
									class="cursor-pointer hover:text-indigo-400 transition-colors"
									>Contact Us</a
								>
							</li>
							<li>
								<a
									@click="store.goToPrivacy"
									class="cursor-pointer hover:text-indigo-400 transition-colors"
									>Privacy Policy</a
								>
							</li>
							<li>
								<a
									@click="store.goToDisclaimer"
									class="cursor-pointer hover:text-indigo-400 transition-colors"
									>Disclaimer</a
								>
							</li>
							<li>
								<a
									@click="store.goToTerms"
									class="cursor-pointer hover:text-indigo-400 transition-colors"
									>Terms of Service</a
								>
							</li>
						</ul>
					</div>

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

				<div class="border-t border-white/10 pt-8 flex flex-col justify-center items-center gap-4">
					<p>&copy; {{ new Date().getFullYear() }} Web2Autos.com LLC. All rights reserved.</p>
					<p>
						Web2Autos is a lead generation platform and is not a lender, broker, or auto dealership. We
						connect consumers with third-party dealerships and financing partners based on credit profile
						and vehicle needs. All financing decisions, approvals, and vehicle transactions are made
						exclusively by licensed dealers or lenders. Information submitted through this site is securely
						encrypted, never sold, and only shared with authorized partners upon user consent. Submitting an
						application authorizes a soft credit inquiry, which does not impact your credit score.
					</p>
					<p>
						Read our
						<a class="cursor-pointer hover:text-indigo-400 transition-colors" @click="store.goToPrivacy"
							>Privacy Policy</a
						>
						and
						<a class="cursor-pointer hover:text-indigo-400 transition-colors" @click="store.goToTerms"
							>Terms of Use</a
						>
						for more details.
					</p>
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

	.bg-layer {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		z-index: 0;
	}

	.orb-1 {
		top: -20%;
		left: -5%;
		width: 50vw;
		height: 50vw;
		background: radial-gradient(circle, rgba(0, 238, 255, 0.7) 0%, rgba(0, 247, 255, 0) 70%);
		animation: float 20s infinite ease-in-out;
	}

	.orb-2 {
		bottom: -30%;
		right: -5%;
		width: 50vw;
		height: 50vw;
		background: radial-gradient(circle, rgba(0, 174, 255, 0.7) 0%, rgba(115, 255, 50, 0) 70%);
		animation: float 25s infinite ease-in-out reverse;
	}

	.header-glass {
		background: rgba(15, 23, 42, 0.6);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.mobile-bottom-sheet {
		overscroll-behavior: contain;
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

	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 3px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 3px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.logo-shine {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0) 40%,
			rgba(255, 255, 255, 0.5) 50%,
			rgba(255, 255, 255, 0) 60%
		);
		transform: translate(-100%, -100%);
		animation: shine 5s infinite;
		z-index: 20;
		pointer-events: none;
	}

	@keyframes float {
		0% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(30px, 50px);
		}
		100% {
			transform: translate(0, 0);
		}
	}

	@keyframes shine {
		0%,
		20% {
			transform: translate(-100%, -100%);
		}
		50%,
		100% {
			transform: translate(100%, 100%);
		}
	}
</style>
