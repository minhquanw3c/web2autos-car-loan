<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import { useLoanStore } from '@/stores/loan'

	const store = useLoanStore()
	const isVisible = ref(false)
	let autoCloseTimer: ReturnType<typeof setTimeout>

	const closePopup = () => {
		isVisible.value = false
		localStorage.setItem('may_promo_dismissed_2025', 'true')
		if (autoCloseTimer) clearTimeout(autoCloseTimer)
	}

	const handleAction = () => {
		closePopup()
		store.goToPromotion()
	}

	onMounted(() => {
		const hasSeen = localStorage.getItem('may_promo_dismissed_2025')
		if (!hasSeen) {
			// Show after 1.5 seconds for better UX so it doesn't jarringly block the immediate page load
			setTimeout(() => {
				isVisible.value = true
				// Auto close after 20 seconds
				autoCloseTimer = setTimeout(() => {
					closePopup()
				}, 20000)
			}, 1500)
		}
	})
</script>

<template>
	<Teleport to="body">
		<transition
			enter-active-class="transition duration-500 ease-out"
			enter-from-class="opacity-0 scale-90 translate-y-8"
			enter-to-class="opacity-100 scale-100 translate-y-0"
			leave-active-class="transition duration-300 ease-in"
			leave-from-class="opacity-100 scale-100 translate-y-0"
			leave-to-class="opacity-0 scale-95 translate-y-8"
		>
			<div v-if="isVisible" class="fixed inset-0 z-[6000] flex items-center justify-center p-4 sm:p-6">
				<!-- Backdrop -->
				<div
					class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
					@click="closePopup"
				></div>

				<!-- Popup Card -->
				<div
					class="relative bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col transform transition-all"
				>
					<!-- Decorative Header -->
					<div
						class="h-32 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400 relative overflow-hidden flex items-center justify-center"
					>
						<div class="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
						<i
							class="fas fa-gift text-6xl text-white drop-shadow-lg transform -rotate-12 hover:rotate-0 transition-transform duration-300"
						></i>
					</div>

					<!-- Close Button -->
					<button
						@click="closePopup"
						class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10 backdrop-blur-sm"
					>
						<i class="fas fa-times"></i>
					</button>

					<!-- Content -->
					<div class="p-8 text-center relative z-10">
						<span
							class="inline-block py-1 px-3 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-bold tracking-widest uppercase text-[10px] mb-4"
							>May Exclusive</span
						>
						<h3 class="text-3xl font-extrabold text-white mb-3">Win Big This May!</h3>
						<p class="text-slate-300 mb-8 leading-relaxed">
							Schedule an appointment and enter to win an iPhone 17, an iPad, an 80-inch TV, or a $500
							Visa Gift Card!
						</p>
						<button
							@click="handleAction"
							class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-indigo-500/30 transition-transform transform hover:-translate-y-1 mb-4"
						>
							Claim Your Entry Now
						</button>
						<button
							@click="closePopup"
							class="text-slate-500 hover:text-slate-300 text-sm transition-colors font-medium"
						>
							No thanks, maybe later
						</button>
					</div>
				</div>
			</div>
		</transition>
	</Teleport>
</template>
