<script setup lang="ts">
	import { ref } from 'vue'
	import { useLoanStore } from '@/stores/loan'

	const store = useLoanStore()
	const isMuted = ref(true)
	const videoIframe = ref<HTMLIFrameElement | null>(null)

	const toggleSound = () => {
		isMuted.value = !isMuted.value
		if (videoIframe.value?.contentWindow) {
			videoIframe.value.contentWindow.postMessage(
				JSON.stringify({
					method: 'setVolume',
					value: isMuted.value ? 0 : 1
				}),
				'*'
			)
		}
	}
</script>

<template>
	<!-- We use negative margins to break out of the parent container's padding and make it truly full-width -->
	<div
		class="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-24 h-[calc(100vh-5rem)] min-h-[550px] md:min-h-[600px] bg-slate-950 flex items-end pb-24 md:pb-0 md:items-center justify-center overflow-hidden"
	>
		<!-- Background Vimeo Video (Using the background=1 param for autoplay/loop/mute) -->
		<div class="absolute inset-0 w-full h-full pointer-events-none opacity-80">
			<iframe
				ref="videoIframe"
				src="https://player.vimeo.com/video/1131989201?autoplay=1&loop=1&muted=1"
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] max-w-none"
				frameborder="0"
				allow="autoplay; fullscreen"
			></iframe>
		</div>

		<!-- Gradient Overlays to ensure text readability and blend with the page -->
		<div
			class="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent z-10 hidden md:block"
		></div>
		<div
			class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950 z-10 md:hidden"
		></div>
		<div
			class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 z-10 hidden md:block"
		></div>

		<!-- Hero Content -->
		<div
			class="relative z-20 flex flex-col items-center md:items-start justify-center px-4 text-center md:text-left w-full max-w-[1600px] mx-auto sm:px-6 lg:px-8 animate-[fadeIn_0.8s_ease-out]"
		>
			<div class="max-w-3xl flex flex-col items-center md:items-start">
				<h1
					class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 md:mb-6 drop-shadow-2xl"
				>
					Apply Once. <br class="hidden md:block" />
					<span class="text-indigo-400">Let AI Do the Work.</span>
				</h1>

				<p class="text-lg sm:text-xl md:text-2xl text-slate-200 mb-8 md:mb-10 leading-relaxed drop-shadow-lg">
					Submit one simple form and get instantly matched with lenders ready to say YES—no matter your
					credit. Fast approvals and as low as <span class="font-bold text-red-500">&dollar;99 down</span> at
					delivery
				</p>

				<div class="flex flex-col sm:flex-row justify-center md:justify-start gap-4 md:gap-5 w-full sm:w-auto">
					<button
						@click="store.startApplication"
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-full shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all transform hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] flex items-center justify-center gap-3 text-lg"
					>
						Apply for Financing <i class="fas fa-arrow-right"></i>
					</button>
					<button
						@click="store.goToInventory"
						class="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/20 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
					>
						Browse Inventory <i class="fas fa-car"></i>
					</button>
				</div>
			</div>
		</div>

		<div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50 hidden md:block">
			<i class="fas fa-chevron-down text-3xl drop-shadow-lg"></i>
		</div>

		<!-- Audio Toggle Button -->
		<div class="absolute top-8 right-6 sm:right-8 lg:right-12 z-30 animate-[fadeIn_1s_ease-out]">
			<button
				@click="toggleSound"
				class="w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white backdrop-blur-md hover:bg-black/60 hover:scale-105 transition-all shadow-xl"
				:title="isMuted ? 'Unmute video' : 'Mute video'"
			>
				<i :class="isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'" class="text-xl"></i>
			</button>
		</div>
	</div>
</template>
