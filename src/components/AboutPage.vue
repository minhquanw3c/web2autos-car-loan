<script setup lang="ts">
	import { useLoanStore } from '@/stores/loan'

	const store = useLoanStore()
</script>

<template>
	<div class="max-w-[1200px] mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-[fadeIn_0.5s_ease-out] text-slate-300">
		<!-- Hero Section -->
		<div class="text-center mb-16">
			<h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md tracking-tight">
				About Web2Autos
			</h1>
			<p class="text-xl md:text-2xl text-indigo-400 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
				Connecting You With Real Opportunities — No Matter Your Credit
			</p>
		</div>

		<!-- Intro Section -->
		<div class="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-xl mb-12">
			<div class="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed text-slate-700">
				<p>
					At Web2Autos, you’re more than just a lead — you’re the reason we exist. We understand how difficult
					it can be to buy a car when your credit history isn’t perfect. That’s why we created Web2Autos: to
					give everyday people access to dealerships that are open to saying yes — with compassion, respect,
					and real solutions.
				</p>
				<p>
					Whether you’ve faced past credit challenges, have no credit at all, or simply need a fresh start,
					we’re here to help match you with a dealership that’s ready to work with you. Our process is fast,
					straightforward, and built to support you — not pressure you.
				</p>
				<p class="text-xl font-bold text-slate-900 text-center py-6 border-y border-slate-200 my-8">
					We’re not here to sell you a car. We’re here to connect you with the people who can — using
					AI-powered tools to perform a secure soft credit check and match you with trusted dealerships and
					lenders, so you don’t have to jump from one dealer to another.
				</p>
			</div>
		</div>

		<!-- Why Web2Autos Works Section -->
		<div class="mb-20 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
			<h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">Why Web2Autos Works</h2>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				<div class="space-y-6 text-lg text-slate-700 leading-relaxed">
					<p>
						At Web2Autos, we help individuals with challenged credit connect with dealerships that are ready
						to give them a real opportunity — with dignity, speed, and professionalism.
					</p>
					<p>While many services stop after collecting your application, we go further.</p>
					<p>
						With over 25 years of experience in auto finance, our founder Danny Tran and the Web2Autos team
						understand the realities of buying a car with credit challenges. We don’t just pass your info
						around. We carefully match you with a participating dealership that actually understands your
						situation and is open to working with you.
					</p>
					<p class="text-sm text-slate-500 italic pt-4">
						Web2Autos is not a lender, broker, or dealership. We don’t make credit decisions — we simply
						connect you with the people who can help.
					</p>
				</div>

				<div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-8">
					<h3 class="text-xl font-bold text-indigo-900 mb-6">Here’s what you can expect when you apply:</h3>
					<ul class="space-y-4">
						<li class="flex items-start gap-4">
							<i class="fas fa-check-circle text-indigo-600 text-xl mt-1 shrink-0"></i>
							<span class="text-slate-800"
								>A personalized match with a dealership that welcomes all credit types</span
							>
						</li>
						<li class="flex items-start gap-4">
							<i class="fas fa-check-circle text-indigo-600 text-xl mt-1 shrink-0"></i>
							<span class="text-slate-800"
								>Financing possibilities — even after repos, bankruptcies, or limited credit
								history</span
							>
						</li>
						<li class="flex items-start gap-4">
							<i class="fas fa-check-circle text-indigo-600 text-xl mt-1 shrink-0"></i>
							<span class="text-slate-800">Options that may include affordable monthly payments</span>
						</li>
						<li class="flex items-start gap-4">
							<i class="fas fa-check-circle text-indigo-600 text-xl mt-1 shrink-0"></i>
							<span class="text-slate-800">The possibility of $0 down and quick delivery</span>
						</li>
						<li class="flex items-start gap-4">
							<i class="fas fa-check-circle text-indigo-600 text-xl mt-1 shrink-0"></i>
							<span class="text-slate-800">One-on-one support from professionals who truly care</span>
						</li>
						<li class="flex items-start gap-4">
							<i class="fas fa-check-circle text-indigo-600 text-xl mt-1 shrink-0"></i>
							<span class="text-slate-800"
								>A smooth, respectful process from application to dealership introduction</span
							>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Trust & CTA Section -->
		<div
			class="bg-white border border-slate-100 rounded-3xl p-8 md:p-16 text-center shadow-xl relative overflow-hidden"
		>
			<div
				class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-50 rounded-full blur-[100px] pointer-events-none"
			></div>

			<div class="relative z-10 max-w-3xl mx-auto space-y-8">
				<h2 class="text-3xl md:text-4xl font-bold text-slate-900">Why So Many Trust Web2Autos</h2>
				<p class="text-lg text-slate-700">
					Because we don’t make empty promises — we focus on real solutions. At Web2Autos, we quietly work
					behind the scenes to ensure your application is seen by the right dealership — one that’s ready to
					help customers with all types of credit situations. By the time you’re introduced to a dealer, your
					information has been reviewed, your documents are in motion, and you’re one step closer to your next
					vehicle.
				</p>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8 text-slate-800 font-medium">
					<div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
						<i class="fas fa-times text-red-500 mr-2"></i> We’re not a bank.
					</div>
					<div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
						<i class="fas fa-times text-red-500 mr-2"></i> We’re not a dealership.
					</div>
					<div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
						<i class="fas fa-times text-red-500 mr-2"></i> Not here to pressure you.
					</div>
					<div class="bg-indigo-50 p-4 rounded-xl border border-indigo-200 text-indigo-900">
						<i class="fas fa-hands-helping text-indigo-600 mr-2"></i> We’re your advocates.
					</div>
				</div>

				<div class="pt-8 border-t border-slate-200">
					<h3 class="text-2xl font-bold text-slate-900 mb-4">Your Journey Starts Here</h3>
					<p class="text-slate-700 mb-8">
						You’re ready to move forward — and we’re ready to help you take the first step. Let’s find the
						right car — and a fresh start — together. Click below to apply in under 60 seconds. There’s no
						obligation, no impact on your credit to pre-qualify, and your information is 100% confidential.
					</p>
					<button
						@click="store.startApplication"
						class="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 inline-flex items-center gap-3"
					>
						<i class="fas fa-file-signature"></i> Apply Now
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
