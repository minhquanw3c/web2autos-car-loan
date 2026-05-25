<script setup lang="ts">
	import { ref } from 'vue'

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
				src="https://player.vimeo.com/video/1194267935?autoplay=1&loop=1&muted=1"
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] max-w-none"
				frameborder="0"
				allow="autoplay; fullscreen"
			></iframe>
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
