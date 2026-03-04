<script setup lang="ts">
	import { useLoanStore } from '@/stores/loan'

	const store = useLoanStore()
</script>

<template>
	<div class="mx-auto py-12 px-4 animate-[fadeIn_0.5s_ease-out] text-slate-800 dark:text-white">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-5xl font-bold mb-6 drop-shadow-md">Disclaimer</h2>
		</div>

		<div
			class="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-xl space-y-8"
		>
			<section>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					Web2Autos is an independent marketing and lead generation platform. We are not a lender, bank, auto
					broker, dealership, or financing institution, and we do not offer auto loans or make credit
					decisions.
				</p>
			</section>

			<section>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					Submitting an application through our website does not guarantee approval, financing terms, or
					vehicle availability. All credit decisions — including approval, interest rates, down payments, and
					terms — are made solely by the participating dealerships or third-party financing providers to whom
					your information is submitted.
				</p>
			</section>

			<section>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					Web2Autos does not influence or control those decisions and is not responsible for the actions,
					offers, or terms of any third-party provider. Financing outcomes depend on multiple factors,
					including your credit history, income, residency, and the availability of participating dealers.
				</p>
			</section>

			<section>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					We make every reasonable effort to connect applicants with potential dealership partners, but
					results may vary, and not all applicants will qualify.
				</p>
			</section>

			<section>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					For questions or more information, please contact: info@web2autos.com
				</p>
			</section>
		</div>

		<div class="text-center mt-12">
			<button
				@click="store.resetView"
				class="inline-flex items-center gap-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white px-8 py-4 rounded-full font-bold transition-all border border-slate-300 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40 active:scale-95"
			>
				<i class="fas fa-arrow-left"></i> Back to Home
			</button>
		</div>
	</div>
</template>
