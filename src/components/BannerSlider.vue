<script setup lang="ts">
	import { ref, onMounted, onUnmounted } from 'vue'
	import { useLoanStore } from '@/stores/loan'

	const store = useLoanStore()

	const banners = [
		{
			id: 5,
			title: 'May Exclusive Giveaway',
			description:
				'Schedule an appointment this May and enter to win an iPhone 17, an iPad, an 80-inch TV, or a $500 Visa Gift Card! No purchase necessary.',
			image: '/e105b708-3a9f-42e8-98eb-d6e2a98216b6.jpg', // Re-using an existing image as placeholder
			cta: 'View Promotion Details'
		},
		{
			id: 4,
			title: 'AI Instant Pre-Qualification',
			description:
				'Our AI technology analyzes your application instantly, answers your questions in real time, and connects you with lenders for faster loan approvals.',
			image: '/238e062b-d019-413e-b1e0-de01d667dde4.jpg',
			cta: 'Apply Now'
		},
		{
			id: 1,
			title: 'Drive Your Dream Car Today',
			description:
				'Get pre-approved in minutes with our secure online application. No impact on your credit score to check rates.',
			image: '/shutterstock_2506974129.webp',
			cta: 'Apply Now'
		},
		{
			id: 2,
			title: 'Competitive Rates & Terms',
			description:
				'We partner with leading financial institutions to bring you the best auto loan rates available.',
			image: '/e105b708-3a9f-42e8-98eb-d6e2a98216b6.jpg',
			cta: null
		},
		{
			id: 3,
			title: 'All Credit Types Welcome',
			description: 'Whether you have excellent credit or are rebuilding, we have a financing solution for you.',
			image: '/web2autos-car.webp',
			cta: null
		}
	]

	const carouselHeight = ref('600px')

	const updateHeight = () => {
		const width = window.innerWidth
		if (width < 1024) {
			carouselHeight.value = '570px'
		} else {
			carouselHeight.value = '650px'
		}
	}

	onMounted(() => {
		updateHeight()
		window.addEventListener('resize', updateHeight)
	})

	onUnmounted(() => {
		window.removeEventListener('resize', updateHeight)
	})

	const handleBannerAction = (banner: { id: number }) => {
		if (banner.id === 1 || banner.id === 4) {
			store.startApplication()
		} else if (banner.id === 5) {
			store.goToPromotion()
		}
	}
</script>

<template>
	<div class="mb-24 animate-[fadeIn_0.6s_ease-out]">
		<el-carousel
			:interval="6000"
			:height="carouselHeight"
			arrow="always"
			class="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
		>
			<el-carousel-item v-for="banner in banners" :key="banner.id">
				<div class="relative w-full h-full group flex flex-col lg:block">
					<!-- Background Image with Zoom Effect -->
					<div class="relative lg:absolute inset-0 overflow-hidden h-[45%] lg:h-full w-full shrink-0">
						<img
							:src="banner.image"
							:alt="banner.title"
							class="w-full h-full object-cover transition-transform duration-[10s] ease-linear transform scale-100 group-hover:scale-110"
						/>
					</div>

					<!-- Gradient Overlay -->
					<div
						class="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"
					></div>

					<!-- Content -->
					<div
						class="relative z-10 flex-1 w-full lg:h-full flex flex-col justify-center px-6 py-6 sm:px-12 sm:py-10 lg:px-20 lg:py-0 bg-slate-900 lg:bg-transparent"
					>
						<div
							class="max-w-3xl lg:bg-black/50 lg:backdrop-blur-md lg:p-10 lg:rounded-3xl lg:border lg:border-white/10"
						>
							<h2
								class="text-2xl sm:text-4xl lg:text-4xl font-extrabold text-white mb-2 lg:mb-4 leading-tight drop-shadow-lg tracking-tight"
							>
								{{ banner.title }}
							</h2>
							<p
								class="text-sm sm:text-lg lg:text-xl text-slate-300 lg:text-slate-200 mb-6 lg:mb-8 max-w-xl leading-relaxed drop-shadow-md"
							>
								{{ banner.description }}
							</p>
							<div v-if="banner.cta">
								<button
									@click="handleBannerAction(banner)"
									class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 hover:shadow-indigo-500/50 flex items-center gap-2"
								>
									{{ banner.cta }} <i class="fas fa-arrow-right"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<style scoped>
	:deep(.el-carousel__button) {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.4);
		transition: all 0.3s;
	}
	:deep(.el-carousel__indicator.is-active .el-carousel__button) {
		background-color: #fff;
	}
	:deep(.el-carousel__arrow) {
		background-color: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(4px);
		top: auto;
		bottom: 20px;
		transform: none;
	}
	:deep(.el-carousel__arrow:hover) {
		background-color: rgba(79, 70, 229, 0.8); /* Indigo 600 */
	}
</style>
