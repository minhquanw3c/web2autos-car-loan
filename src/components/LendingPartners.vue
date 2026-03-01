<script setup lang="ts">
	const partners = [
		{ name: 'Ally Financial', image: '/logo_01.png' },
		{ name: 'Capital One', image: '/logo_01.png' },
		{ name: 'Wells Fargo', image: '/logo_01.png' },
		{ name: 'Chase Auto', image: '/logo_01.png' },
		{ name: 'Bank of America', image: '/logo_01.png' },
		{ name: 'Santander', image: '/logo_01.png' },
		{ name: 'US Bank', image: '/logo_01.png' },
		{ name: 'PNC Bank', image: '/logo_01.png' },
		{ name: 'Truist', image: '/logo_01.png' },
		{ name: 'TD Bank', image: '/logo_01.png' },
		{ name: 'Citizens Bank', image: '/logo_01.png' },
		{ name: 'Fifth Third Bank', image: '/logo_01.png' },
		{ name: 'BMO Harris', image: '/logo_01.png' },
		{ name: 'KeyBank', image: '/logo_01.png' },
		{ name: 'Regions Bank', image: '/logo_01.png' },
		{ name: 'M&T Bank', image: '/logo_01.png' },
		{ name: 'Huntington', image: '/logo_01.png' },
		{ name: 'Discover', image: '/logo_01.png' },
		{ name: 'Synchrony', image: '/logo_01.png' },
		{ name: 'Navy Federal', image: '/logo_01.png' }
	]
</script>

<template>
	<div class="mb-24 space-y-16 animate-[fadeIn_0.6s_ease-out]">
		<div class="text-center">
			<h2 class="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
				<i class="fas fa-handshake text-indigo-400 mr-2"></i>Our Lending Partners
			</h2>
			<p class="text-blue-200 text-sm md:text-base max-w-2xl mx-auto">
				We work with the nation's top financial institutions to secure the best rates for your auto loan.
			</p>
		</div>

		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
			<div
				v-for="(partner, index) in partners"
				:key="index"
				class="partner-card group relative bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-xl h-32 flex items-center justify-center overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-default hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/20"
			>
				<!-- Glow effect -->
				<div
					class="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500"
				></div>

				<!-- Logo (Background) -->
				<div
					class="absolute inset-0 flex items-center justify-center p-4 md:p-6 transition-transform duration-500 group-hover:scale-105"
				>
					<img
						:src="partner.image"
						:alt="partner.name"
						class="w-full h-full object-contain opacity-30 grayscale filter group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
					/>
				</div>

				<!-- Name (Foreground) -->
				<h3
					class="absolute bottom-2 right-2 z-10 text-gray-300 font-bold text-base md:text-lg text-right group-hover:text-white transition-colors duration-300 bg-slate-900/60 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/5 group-hover:border-white/20 group-hover:bg-slate-900/80 shadow-sm"
				>
					{{ partner.name }}
				</h3>
			</div>
		</div>
	</div>
</template>

<style scoped>
	/* Scoped styles if needed */
</style>
