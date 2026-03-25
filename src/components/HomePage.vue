<script setup lang="ts">
	import { useLoanStore } from '@/stores/loan'
	import BannerSlider from '@/components/BannerSlider.vue'
	import LendingPartners from '@/components/LendingPartners.vue'
	import FeaturedInventory from '@/components/FeaturedInventory.vue'
	import CustomerReviews from '@/components/CustomerReviews.vue'
	import VideoPlayer from '@/components/VideoPlayer.vue'
	import StepsSection from '@/components/StepsSection.vue'

	const store = useLoanStore()
</script>

<template>
	<div class="animate-[fadeIn_0.5s_ease-out]">
		<BannerSlider />
		<LendingPartners />

		<FeaturedInventory />

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
							We’re not here to sell you a car. We’re here to connect you with the people who can — using
							AI-powered tools to perform a secure soft credit check and match you with trusted
							dealerships and lenders, so you don’t have to jump from one dealer to another.
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
