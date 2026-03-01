<script setup lang="ts">
	import { ref, computed, onMounted, onUnmounted } from 'vue'

	const reviews = [
		{
			id: 1,
			name: 'Michael R.',
			location: 'Austin, TX',
			rating: 5,
			text: 'The process was incredibly smooth. I got pre-approved in minutes and drove off the lot the same day. Highly recommend Web2Autos!',
			verified: true,
			initials: 'MR'
		},
		{
			id: 2,
			name: 'Sarah L.',
			location: 'San Jose, CA',
			rating: 5,
			text: 'I was worried about my credit score, but they found a lender that worked with me. The interest rate was much better than I expected.',
			verified: true,
			initials: 'SL'
		},
		{
			id: 3,
			name: 'David K.',
			location: 'Miami, FL',
			rating: 5,
			text: 'Great selection of vehicles and transparent pricing. No hidden fees. The loan calculator was spot on.',
			verified: true,
			initials: 'DK'
		},
		{
			id: 4,
			name: 'Emily W.',
			location: 'Denver, CO',
			rating: 5,
			text: 'Customer service was top notch. They answered all my questions and made me feel comfortable throughout the entire process.',
			verified: true,
			initials: 'EW'
		},
		{
			id: 5,
			name: 'James P.',
			location: 'Seattle, WA',
			rating: 5,
			text: 'I found the perfect truck for my business. The financing terms were flexible and exactly what I needed.',
			verified: true,
			initials: 'JP'
		},
		{
			id: 6,
			name: 'Olivia H.',
			location: 'Boston, MA',
			rating: 5,
			text: 'Fast, easy, and reliable. I applied in the morning and had my car by the afternoon. Truly a seamless experience.',
			verified: true,
			initials: 'OH'
		}
	]

	const windowWidth = ref(window.innerWidth)

	const updateWidth = () => {
		windowWidth.value = window.innerWidth
	}

	onMounted(() => window.addEventListener('resize', updateWidth))
	onUnmounted(() => window.removeEventListener('resize', updateWidth))

	const itemsPerSlide = computed(() => (windowWidth.value < 768 ? 1 : 3))

	const groupedReviews = computed(() => {
		const groups = []
		for (let i = 0; i < reviews.length; i += itemsPerSlide.value) {
			groups.push(reviews.slice(i, i + itemsPerSlide.value))
		}
		return groups
	})
</script>

<template>
	<div class="mb-24 animate-[fadeIn_0.6s_ease-out]">
		<div class="text-center mb-12">
			<h2 class="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">
				<i class="fas fa-comments text-indigo-400 mr-2"></i>What Our Customers Say
			</h2>
			<p class="text-blue-200 text-sm md:text-base max-w-2xl mx-auto">
				Don't just take our word for it. Read genuine feedback from our satisfied customers across the country.
			</p>
		</div>

		<el-carousel
			:interval="5000"
			arrow="always"
			indicator-position="outside"
			:height="itemsPerSlide === 1 ? '340px' : '320px'"
			class="reviews-carousel"
		>
			<el-carousel-item v-for="(group, index) in groupedReviews" :key="index">
				<div
					class="grid gap-6 h-full items-center"
					:class="itemsPerSlide === 1 ? 'grid-cols-1 px-8' : 'grid-cols-3 px-12'"
				>
					<div
						v-for="review in group"
						:key="review.id"
						class="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col relative group hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-indigo-500/20 h-full"
					>
						<!-- Quote Icon -->
						<div
							class="absolute top-4 right-6 text-6xl text-indigo-500/10 font-serif leading-none select-none"
						>
							&rdquo;
						</div>

						<!-- Stars -->
						<div class="flex gap-1 mb-4 text-yellow-400 text-sm">
							<i v-for="n in 5" :key="n" class="fas fa-star"></i>
						</div>

						<!-- Text -->
						<p class="text-gray-300 text-sm leading-relaxed mb-6 flex-grow relative z-10">
							"{{ review.text }}"
						</p>

						<!-- User Info -->
						<div class="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
							<div
								class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md"
							>
								{{ review.initials }}
							</div>
							<div>
								<div class="flex items-center gap-2">
									<h4 class="text-white font-bold text-sm">{{ review.name }}</h4>
									<span
										v-if="review.verified"
										class="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-green-500/20"
									>
										<i class="fas fa-check-circle"></i> Verified
									</span>
								</div>
								<p class="text-xs text-gray-500">{{ review.location }}</p>
							</div>
						</div>
					</div>
				</div>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<style scoped>
	:deep(.el-carousel__arrow) {
		background-color: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(4px);
	}
	:deep(.el-carousel__arrow:hover) {
		background-color: rgba(79, 70, 229, 0.8); /* Indigo 600 */
	}
</style>
