<script setup lang="ts">
	import { useLoanStore } from '@/stores/loan'

	const store = useLoanStore()
</script>

<template>
	<div class="max-w-6xl mx-auto py-12 px-4 animate-[fadeIn_0.5s_ease-out]">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">Contact Us</h2>
			<p class="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto">
				Have questions? We're here to help you get into your dream car. Reach out to us through any of the
				channels below.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
			<!-- Phone -->
			<div
				class="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:bg-slate-800/80 transition-all duration-300 group hover:-translate-y-2 shadow-xl"
			>
				<div
					class="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform"
				>
					<i class="fas fa-phone-alt text-3xl text-white"></i>
				</div>
				<h3 class="text-2xl font-bold text-white mb-2">Phone</h3>
				<p class="text-slate-400 mb-6">Call us 24/7 for assistance</p>
				<a
					href="tel:8449227227"
					class="text-white font-bold text-xl hover:text-indigo-400 transition-colors block mb-2"
					>(844) 922-7227</a
				>
				<a href="tel:4086461313" class="text-slate-400 text-sm hover:text-indigo-400 transition-colors block"
					>Direct: (408) 646-1313</a
				>
			</div>

			<!-- Email -->
			<div
				class="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:bg-slate-800/80 transition-all duration-300 group hover:-translate-y-2 shadow-xl"
			>
				<div
					class="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform"
				>
					<i class="fas fa-envelope text-3xl text-white"></i>
				</div>
				<h3 class="text-2xl font-bold text-white mb-2">Email</h3>
				<p class="text-slate-400 mb-6">Send us a message anytime</p>
				<a
					href="mailto:info@web2autos.com"
					class="text-white font-bold text-xl hover:text-sky-400 transition-colors break-all"
					>info@web2autos.com</a
				>
			</div>

			<!-- Address -->
			<div
				class="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:bg-slate-800/80 transition-all duration-300 group hover:-translate-y-2 shadow-xl"
			>
				<div
					class="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform"
				>
					<i class="fas fa-map-marker-alt text-3xl text-white"></i>
				</div>
				<h3 class="text-2xl font-bold text-white mb-2">Office</h3>
				<p class="text-slate-400 mb-6">Visit our location</p>
				<p class="text-white font-bold text-lg leading-relaxed">
					38623 FREMONT BLVD STE 185,<br />FREMONT, CA 94536
				</p>
			</div>
		</div>

		<div class="text-center">
			<button
				@click="store.resetView"
				class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold transition-all border border-white/20 hover:border-white/40 active:scale-95"
			>
				<i class="fas fa-arrow-left"></i> Back to Home
			</button>
		</div>
	</div>
</template>
