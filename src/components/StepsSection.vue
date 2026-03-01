<script setup lang="ts">
	const steps = [
		{
			id: 1,
			title: 'Fill Out Application',
			description:
				'Complete our secure online application in just a few minutes. No impact on your credit score to check rates.',
			icon: 'fas fa-file-signature',
			color: 'text-blue-400',
			bg: 'bg-blue-400/10'
		},
		{
			id: 2,
			title: 'Get Approved',
			description:
				'Our network of trusted lenders competes to give you the best rates and terms, regardless of your credit history.',
			icon: 'fas fa-check-circle',
			color: 'text-green-400',
			bg: 'bg-green-400/10'
		},
		{
			id: 3,
			title: 'Drive Your Car Home',
			description:
				'Select your vehicle, sign the paperwork electronically, and drive away or have it delivered to your doorstep.',
			icon: 'fas fa-car',
			color: 'text-indigo-400',
			bg: 'bg-indigo-400/10'
		}
	]
</script>

<template>
	<div class="mb-24 animate-[fadeIn_0.6s_ease-out]">
		<div class="text-center mb-16">
			<h2 class="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">
				<i class="fas fa-road text-indigo-400 mr-2"></i>Your Journey to a New Car
			</h2>
			<p class="text-blue-200 text-sm md:text-base max-w-2xl mx-auto">
				We've simplified the car buying process into three easy steps.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative px-4">
			<!-- Connecting Line (Desktop) -->
			<div
				class="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500/20 via-indigo-500/40 to-indigo-500/20 z-0"
			></div>

			<div
				v-for="step in steps"
				:key="step.id"
				class="relative z-10 flex flex-col items-center text-center group"
			>
				<!-- Icon Circle -->
				<div
					class="w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] border border-white/10 backdrop-blur-md relative"
					:class="step.bg"
				>
					<i :class="[step.icon, step.color, 'text-3xl']"></i>
					<!-- Step Number Badge -->
					<div
						class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-sm font-bold text-white shadow-lg"
					>
						{{ step.id }}
					</div>
				</div>

				<h3 class="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
					{{ step.title }}
				</h3>
				<p class="text-slate-400 text-sm leading-relaxed max-w-xs">{{ step.description }}</p>
			</div>
		</div>
	</div>
</template>
