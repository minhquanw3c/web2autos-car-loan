<script setup lang="ts">
	import { ref, onMounted, onUnmounted } from 'vue'
	import { useLoanStore } from '@/stores/loan'

	const store = useLoanStore()

	const banners = [
		{
			id: 1,
			title: 'Drive Your Dream Car Today',
			description:
				'Get pre-approved in minutes with our secure online application. No impact on your credit score to check rates.',
			image: '/peter-broomfield-m3m-lnR90uM-unsplash.jpg',
			cta: 'Apply Now'
		},
		{
			id: 2,
			title: 'Competitive Rates & Terms',
			description:
				'We partner with leading financial institutions to bring you the best auto loan rates available.',
			image: '/campbell-3ZUsNJhi_Ik-unsplash.jpg',
			cta: null
		},
		{
			id: 3,
			title: 'All Credit Types Welcome',
			description: 'Whether you have excellent credit or are rebuilding, we have a financing solution for you.',
			image: '/olav-tvedt-6lSBynPRaAQ-unsplash.jpg',
			cta: null
		}
	]

	const carouselHeight = ref('500px')

	const updateHeight = () => {
		const width = window.innerWidth
		if (width < 640) {
			carouselHeight.value = '300px'
		} else if (width < 1024) {
			carouselHeight.value = '400px'
		} else {
			carouselHeight.value = '500px'
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
		if (banner.id === 1) {
			store.startApplication()
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
				<div class="relative w-full h-full group">
					<!-- Background Image with Zoom Effect -->
					<div class="absolute inset-0 overflow-hidden">
						<img
							:src="banner.image"
							:alt="banner.title"
							class="w-full h-full object-cover transition-transform duration-[10s] ease-linear transform scale-100 group-hover:scale-110"
						/>
					</div>

					<!-- Gradient Overlay -->
					<div class="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>

					<!-- Content -->
					<div class="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-3xl">
						<h2
							class="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg tracking-tight"
						>
							{{ banner.title }}
						</h2>
						<p
							class="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed drop-shadow-md"
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
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<style scoped>
	:deep(.el-carousel__button) {
		width: 40px;
		height: 4px;
		border-radius: 2px;
		background-color: rgba(255, 255, 255, 0.3);
		transition: all 0.3s;
	}
	:deep(.el-carousel__indicator.is-active .el-carousel__button) {
		background-color: #fff;
		width: 60px;
	}
	:deep(.el-carousel__arrow) {
		background-color: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(4px);
		top: auto;
		bottom: 20px;
		transform: none;
	}
	:deep(.el-carousel__arrow:hover) {
		background-color: rgba(79, 70, 229, 0.8); /* Indigo 600 */
	}
</style>
