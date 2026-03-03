<script setup lang="ts">
	const partners = [
		{ name: 'Ally', logo: 'ally.svg' },
		{ name: 'Ameri Credit', logo: 'ameri_credit.png' },
		{ name: 'Capital One', logo: 'capital_one.svg' },
		{ name: 'Chase', logo: 'chase.svg' },
		{ name: 'Exeter Finance', logo: 'exeter_finance.svg' },
		{ name: 'Global Lending Services', logo: 'global_lending_services.png' },
		{ name: 'GOFI Auto Finance', logo: 'go_fi.png' },
		{ name: 'SAFCO Acceptance', logo: 'gosafco.svg' },
		{ name: 'Lendbuzz', logo: 'lendbuzz.svg' },
		{ name: 'OneMain Financial', logo: 'onemain_financial.svg' },
		{ name: 'Regional Acceptance', logo: 'regional_acceptance.svg' },
		{ name: 'Santander', logo: 'santander_consumer_usa.svg' },
		{ name: 'Upgrade Auto Loans', logo: 'upgrade.svg' },
		{ name: 'Wells Fargo', logo: 'wells_fargo.svg' }
	]
</script>

<template>
	<div class="mb-24 py-8 animate-[fadeIn_0.8s_ease-out] overflow-hidden">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-md">Our Lending Partners</h2>
			<p class="text-blue-200 text-lg max-w-2xl mx-auto">
				We work with top financial institutions to secure your loan
			</p>
		</div>

		<div class="relative w-full">
			<div
				class="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"
			></div>
			<div
				class="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"
			></div>

			<div class="flex w-max animate-marquee hover:[animation-play-state:paused]">
				<div v-for="i in 3" :key="i" class="flex gap-6 mx-3">
					<div
						v-for="partner in partners"
						:key="`${i}-${partner.name}`"
						class="bg-white rounded-xl p-4 flex items-center justify-center h-24 w-48 md:h-28 md:w-60 shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer"
					>
						<img
							:src="`/bank_logos/${partner.logo}`"
							:alt="partner.name"
							class="max-h-12 md:max-h-16 w-auto object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
							loading="lazy"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.animate-marquee {
		animation: marquee 100s linear infinite;
	}

	@keyframes marquee {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-33.33%);
		}
	}
</style>
