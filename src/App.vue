<script setup lang="ts">
	import { onMounted, onUnmounted, ref, computed } from 'vue'
	import { useLoanStore } from '@/stores/loan'
	import { useI18n } from 'vue-i18n'
	import en from 'element-plus/es/locale/lang/en'
	import es from 'element-plus/es/locale/lang/es'
	import HomePage from '@/components/HomePage.vue'
	import InventoryPage from '@/components/InventoryPage.vue'
	import ConsultantForm from '@/components/ConsultantForm.vue'
	import StepsSection from '@/components/StepsSection.vue'
	import ContactPage from '@/components/ContactPage.vue'
	import PrivacyPage from '@/components/PrivacyPage.vue'
	import TermsPage from '@/components/TermsPage.vue'
	import DisclaimerPage from '@/components/DisclaimerPage.vue'
	import DealershipInquiryPage from '@/components/DealershipInquiryPage.vue'
	import CarFinderForm from '@/components/CarFinderForm.vue'
	import AboutPage from '@/components/AboutPage.vue'
	import PromotionPage from '@/components/PromotionPage.vue'
	import FullScreenLoader from '@/components/FullScreenLoader.vue'

	const store = useLoanStore()
	const isMobileMenuOpen = ref(false)

	const { locale } = useI18n()
	// Dynamically compute the Element Plus locale based on vue-i18n's current locale
	const elLocale = computed(() => (locale.value === 'es' ? es : en))

	const switchLanguage = (lang: 'en' | 'es') => {
		locale.value = lang
		localStorage.setItem('user-locale', lang)
	}

	const handlePopState = () => {
		const urlParams = new URLSearchParams(window.location.search)

		if (urlParams.get('showApplication') === 'true') {
			store.currentView = 'application'
		} else if (urlParams.get('showAbout') === 'true') {
			store.currentView = 'about'
		} else if (urlParams.get('showContact') === 'true') {
			store.currentView = 'contact'
		} else if (urlParams.get('showPrivacy') === 'true') {
			store.currentView = 'privacy'
		} else if (urlParams.get('showTerms') === 'true') {
			store.currentView = 'terms'
		} else if (urlParams.get('showDisclaimer') === 'true') {
			store.currentView = 'disclaimer'
		} else if (urlParams.get('showInventory') === 'true' || urlParams.get('vehicle_id')) {
			store.currentView = 'inventory'
			if (urlParams.get('vehicle_id')) {
				store.processDeepLink()
			} else {
				store.selectedVehicle = null
			}
		} else if (urlParams.get('showDealershipInquiry') === 'true') {
			store.currentView = 'dealership-inquiry'
		} else if (urlParams.get('showCarFinder') === 'true') {
			store.currentView = 'car-finder'
		} else if (urlParams.get('showPromotion') === 'true') {
			store.currentView = 'promotion'
		} else {
			store.currentView = 'home'
			store.selectedVehicle = null
		}
	}

	onMounted(() => {
		store.fetchInventory()

		// Check URL for direct application access
		const urlParams = new URLSearchParams(window.location.search)
		if (urlParams.get('showApplication') === 'true') {
			store.startApplication()
		} else if (urlParams.get('showAbout') === 'true') {
			store.goToAbout()
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
		} else if (urlParams.get('showCarFinder') === 'true') {
			store.goToCarFinder()
		} else if (urlParams.get('showPromotion') === 'true') {
			store.goToPromotion()
		}

		window.addEventListener('popstate', handlePopState)

		// Embed Chat Widget
		const script = document.createElement('script')
		script.src = 'https://beta.leadconnectorhq.com/loader.js'
		script.setAttribute('data-resources-url', 'https://beta.leadconnectorhq.com/chat-widget/loader.js')
		script.setAttribute('data-widget-id', '68b77d83c08a475db08c6e02')
		document.body.appendChild(script)
	})

	onUnmounted(() => {
		window.removeEventListener('popstate', handlePopState)
	})
</script>

<template>
	<el-config-provider :locale="elLocale">
		<div class="app-layout bg-slate-900 transition-colors duration-300">
			<FullScreenLoader
				:visible="
					store.isFetchingVehicles && store.inventory.length === 0 && store.currentView !== 'onboarding'
				"
				:text="store.loadingMessage"
			/>

			<!-- Mobile Menu Overlay -->
			<transition
				enter-active-class="transition duration-200 ease-out"
				enter-from-class="opacity-0 scale-95"
				enter-to-class="opacity-100 scale-100"
				leave-active-class="transition duration-150 ease-in"
				leave-from-class="opacity-100 scale-100"
				leave-to-class="opacity-0 scale-95"
			>
				<div v-if="isMobileMenuOpen" class="fixed inset-0 z-[5000] bg-slate-950 flex flex-col">
					<div class="flex justify-end p-6">
						<button
							@click="isMobileMenuOpen = false"
							class="text-slate-400 hover:text-white p-2 transition-colors"
						>
							<i class="fas fa-times text-4xl"></i>
						</button>
					</div>
					<div class="flex-1 flex flex-col items-center justify-center pb-20 w-full px-6">
						<div class="w-full max-w-sm flex flex-col divide-y divide-white/10">
							<a
								@click="
									() => {
										store.resetView()
										isMobileMenuOpen = false
									}
								"
								class="block w-full text-center py-5 text-2xl font-medium text-slate-100 hover:text-indigo-400 transition-colors cursor-pointer tracking-wide"
								>{{ $t('nav.home') }}</a
							>
							<a
								@click="
									() => {
										store.goToInventory()
										isMobileMenuOpen = false
									}
								"
								class="block w-full text-center py-5 text-2xl font-medium text-slate-100 hover:text-indigo-400 transition-colors cursor-pointer tracking-wide"
								>{{ $t('nav.inventory') }}</a
							>
							<a
								@click="
									() => {
										store.goToAbout()
										isMobileMenuOpen = false
									}
								"
								class="block w-full text-center py-5 text-2xl font-medium text-slate-100 hover:text-indigo-400 transition-colors cursor-pointer tracking-wide"
								>{{ $t('nav.about') }}</a
							>
							<a
								@click="
									() => {
										store.startApplication()
										isMobileMenuOpen = false
									}
								"
								class="block w-full text-center py-5 text-2xl font-medium text-slate-100 hover:text-indigo-400 transition-colors cursor-pointer tracking-wide"
								>{{ $t('nav.apply') }}</a
							>
							<a
								@click="
									() => {
										store.goToContact()
										isMobileMenuOpen = false
									}
								"
								class="block w-full text-center py-5 text-2xl font-medium text-slate-100 hover:text-indigo-400 transition-colors cursor-pointer tracking-wide"
								>{{ $t('nav.contact') }}</a
							>
							<a
								@click="
									() => {
										store.goToDealershipInquiry()
										isMobileMenuOpen = false
									}
								"
								class="block w-full text-center py-5 text-2xl font-medium text-slate-100 hover:text-indigo-400 transition-colors cursor-pointer tracking-wide"
								>{{ $t('nav.dealers') }}</a
							>
							<a
								@click="
									() => {
										store.goToCarFinder()
										isMobileMenuOpen = false
									}
								"
								class="block w-full text-center py-5 text-2xl font-medium text-slate-100 hover:text-indigo-400 transition-colors cursor-pointer tracking-wide"
								>{{ $t('nav.car_finder') }}</a
							>
						</div>

						<div class="flex gap-6 mt-8">
							<a
								href="https://www.facebook.com/profile.php?id=61580498513700"
								target="_blank"
								class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-indigo-600 transition-all"
							>
								<i class="fab fa-facebook-f text-xl"></i>
							</a>
							<a
								href="https://www.tiktok.com/@web2autos"
								target="_blank"
								class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-sky-500 transition-all"
							>
								<i class="fab fa-tiktok text-xl"></i>
							</a>
						</div>
					</div>
				</div>
			</transition>

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
						<nav class="hidden lg:flex items-center gap-3 xl:gap-5 mr-4">
							<a
								@click="store.resetView"
								:class="
									store.currentView === 'home'
										? 'text-white font-bold'
										: 'text-slate-300 hover:text-white'
								"
								class="cursor-pointer transition-colors text-sm uppercase tracking-wide"
								>{{ $t('nav.home') }}</a
							>
							<span
								class="text-white/20 select-none transition-colors duration-300 [a:hover+&]:text-indigo-400 [&:has(+a:hover)]:text-indigo-400"
								>/</span
							>
							<a
								@click="store.goToInventory"
								:class="
									store.currentView === 'inventory'
										? 'text-white font-bold'
										: 'text-slate-300 hover:text-white'
								"
								class="cursor-pointer transition-colors text-sm uppercase tracking-wide"
								>{{ $t('nav.inventory') }}</a
							>
							<span
								class="text-white/20 select-none transition-colors duration-300 [a:hover+&]:text-indigo-400 [&:has(+a:hover)]:text-indigo-400"
								>/</span
							>
							<a
								@click="store.goToAbout"
								:class="
									store.currentView === 'about'
										? 'text-white font-bold'
										: 'text-slate-300 hover:text-white'
								"
								class="cursor-pointer transition-colors text-sm uppercase tracking-wide"
								>{{ $t('nav.about') }}</a
							>
							<span
								class="text-white/20 select-none transition-colors duration-300 [a:hover+&]:text-indigo-400 [&:has(+a:hover)]:text-indigo-400"
								>/</span
							>
							<a
								@click="store.goToContact"
								:class="
									store.currentView === 'contact'
										? 'text-white font-bold'
										: 'text-slate-300 hover:text-white'
								"
								class="cursor-pointer transition-colors text-sm uppercase tracking-wide"
								>{{ $t('nav.contact') }}</a
							>
							<span
								class="text-white/20 select-none transition-colors duration-300 [a:hover+&]:text-indigo-400 [&:has(+a:hover)]:text-indigo-400"
								>/</span
							>
							<a
								@click="store.goToDealershipInquiry"
								:class="
									store.currentView === 'dealership-inquiry'
										? 'text-white font-bold'
										: 'text-slate-300 hover:text-white'
								"
								class="cursor-pointer transition-colors text-sm uppercase tracking-wide"
								>{{ $t('nav.dealers') }}</a
							>
							<span
								class="text-white/20 select-none transition-colors duration-300 [a:hover+&]:text-indigo-400 [&:has(+a:hover)]:text-indigo-400"
								>/</span
							>
							<a
								@click="store.goToCarFinder"
								:class="
									store.currentView === 'car-finder'
										? 'text-white font-bold'
										: 'text-slate-300 hover:text-white'
								"
								class="cursor-pointer transition-colors text-sm uppercase tracking-wide"
								>{{ $t('nav.car_finder') }}</a
							>
						</nav>

						<button
							v-if="store.currentView !== 'application'"
							@click="store.startApplication()"
							class="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
						>
							<i class="fas fa-file-signature"></i> {{ $t('nav.apply') }}
						</button>

						<!-- Mobile Menu Button -->
						<button
							@click="isMobileMenuOpen = true"
							class="lg:hidden text-white p-2 focus:outline-none ml-2"
						>
							<i class="fas fa-bars text-2xl"></i>
						</button>

						<!-- Language Switcher -->
						<!-- <el-dropdown @command="switchLanguage" trigger="click" class="ml-2 lg:ml-0">
							<span
								class="text-white cursor-pointer flex items-center gap-1 font-medium hover:text-indigo-400 transition-colors outline-none"
							>
								<i class="fas fa-globe"></i> {{ locale === 'es' ? 'ES' : 'EN' }}
								<i class="fas fa-chevron-down text-xs ml-1 mt-[2px]"></i>
							</span>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item command="en" :disabled="locale === 'en'"
										>English</el-dropdown-item
									>
									<el-dropdown-item command="es" :disabled="locale === 'es'"
										>Español</el-dropdown-item
									>
								</el-dropdown-menu>
							</template>
						</el-dropdown> -->

						<div class="hidden lg:flex flex-col items-end mr-2">
							<span class="text-[10px] text-gray-400 uppercase font-bold">{{
								$t('nav.sales_hotline')
							}}</span>
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

					<div v-else-if="store.currentView === 'about'" key="about">
						<AboutPage />
					</div>

					<div v-else-if="store.currentView === 'application'" key="app">
						<ConsultantForm />
					</div>

					<div v-else-if="store.currentView === 'promotion'" key="promotion">
						<PromotionPage />
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

					<div v-else-if="store.currentView === 'car-finder'" key="car-finder">
						<CarFinderForm />
					</div>
				</transition>
			</main>

			<footer
				class="relative z-20 border-t border-white/10 bg-slate-900/60 backdrop-blur-xl text-slate-400 text-sm xl:mb-0 transition-colors duration-300"
			>
				<div class="max-w-[1800px] mx-auto px-4 py-12">
					<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						<div class="col-span-1 md:col-span-1">
							<div
								class="flex items-center gap-2 mb-4 text-white cursor-pointer"
								@click="store.resetView"
							>
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
								Get approved for a car today — even with low credit or past issues. Web2Autos connects
								you with lenders ready to say YES. Apply in minutes and see your options now.
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
										@click="store.goToAbout"
										class="cursor-pointer hover:text-indigo-400 transition-colors"
										>About Us</a
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
							connect consumers with third-party dealerships and financing partners based on credit
							profile and vehicle needs. All financing decisions, approvals, and vehicle transactions are
							made exclusively by licensed dealers or lenders. Information submitted through this site is
							securely encrypted, never sold, and only shared with authorized partners upon user consent.
							Submitting an application authorizes a soft credit inquiry, which does not impact your
							credit score.
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
	</el-config-provider>
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
