<script setup lang="ts">
	import { useLoanStore } from '@/stores/loan'

	const store = useLoanStore()
</script>

<template>
	<div class="max-w-[1200px] mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-[fadeIn_0.5s_ease-out] text-slate-300">
		<!-- Hero Section -->
		<div class="text-center mb-16 relative">
			<div
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"
			></div>
			<div class="relative z-10">
				<span
					class="inline-block py-1 px-4 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-bold tracking-widest uppercase text-xs mb-6"
				>
					Upcoming May Incentive
				</span>
				<h1
					class="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md tracking-tight leading-tight"
				>
					Celebrate with Web2Autos <br />
					<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
						And Win Big This May!
					</span>
				</h1>
				<p class="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed drop-shadow-sm mb-8">
					April has been an outstanding month at Web2Autos.com, with over 100 customers successfully getting
					behind the wheel of their next vehicle. As we move into the new month, we want to make sure you
					don’t miss a valuable opportunity to move forward with confidence—and be rewarded for doing so.
				</p>
				<p
					class="text-xl md:text-2xl text-indigo-300 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-sm"
				>
					Starting soon, when you schedule and attend an appointment by
					<span class="font-bold text-white">May 31</span>, you will be automatically entered into our
					exclusive raffle!
				</p>
			</div>
		</div>

		<!-- Prizes Section -->
		<div class="mb-20">
			<h2 class="text-3xl font-bold text-white text-center mb-10">Amazing Prizes to Win</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
				<!-- 1st Prize -->
				<div
					class="bg-gradient-to-b from-indigo-900/50 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 text-center shadow-xl transform transition hover:-translate-y-2 hover:shadow-indigo-500/20 group"
				>
					<div
						class="w-20 h-20 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
					>
						<i class="fas fa-mobile-alt text-4xl text-indigo-400"></i>
					</div>
					<h3 class="text-xl font-bold text-indigo-400 mb-2 uppercase tracking-wide">1st Prize</h3>
					<p class="text-3xl font-extrabold text-white">iPhone 17</p>
				</div>
				<!-- 2nd Prize -->
				<div
					class="bg-gradient-to-b from-slate-800/80 to-slate-900 border border-white/10 rounded-3xl p-8 text-center shadow-xl transform transition hover:-translate-y-2 hover:border-white/30 group"
				>
					<div
						class="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
					>
						<i class="fas fa-tv text-4xl text-slate-200"></i>
					</div>
					<h3 class="text-xl font-bold text-slate-400 mb-2 uppercase tracking-wide">2nd Prize</h3>
					<p class="text-2xl font-extrabold text-white">
						iPad <span class="font-normal text-lg text-slate-400 mx-2">or</span> 80" TV
					</p>
				</div>
				<!-- 3rd Prize -->
				<div
					class="bg-gradient-to-b from-slate-800/80 to-slate-900 border border-white/10 rounded-3xl p-8 text-center shadow-xl transform transition hover:-translate-y-2 hover:border-white/30 group"
				>
					<div
						class="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
					>
						<i class="fas fa-credit-card text-4xl text-slate-200"></i>
					</div>
					<h3 class="text-xl font-bold text-slate-400 mb-2 uppercase tracking-wide">3rd Prize</h3>
					<p class="text-2xl font-extrabold text-white">$500 Visa Gift Card</p>
				</div>
			</div>
			<p class="text-center text-slate-400 mt-6 italic">No purchase is necessary to participate.</p>
		</div>

		<!-- How to Enter & Eligibility -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
			<!-- How to Enter -->
			<div class="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-xl backdrop-blur-sm">
				<h3 class="text-2xl font-bold text-white mb-8 flex items-center gap-3">
					<i class="fas fa-clipboard-list text-indigo-400"></i> How to Enter
				</h3>
				<div class="space-y-6">
					<div class="flex gap-4">
						<div
							class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-indigo-600/30"
						>
							1
						</div>
						<div>
							<h4 class="text-lg font-bold text-slate-200 mb-1">Schedule your appointment</h4>
							<p class="text-slate-400">Book a time to discuss your auto needs with us.</p>
						</div>
					</div>
					<div class="flex gap-4">
						<div
							class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-indigo-600/30"
						>
							2
						</div>
						<div>
							<h4 class="text-lg font-bold text-slate-200 mb-1">Attend & explore options</h4>
							<p class="text-slate-400">
								Visit one of our trusted dealership partners to explore your vehicle options.
							</p>
						</div>
					</div>
					<div class="flex gap-4">
						<div
							class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-indigo-600/30"
						>
							3
						</div>
						<div>
							<h4 class="text-lg font-bold text-slate-200 mb-1">Automatic entry</h4>
							<p class="text-slate-400">
								Upon completion, you will be automatically entered into the raffle!
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Eligibility -->
			<div
				class="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-xl backdrop-blur-sm flex flex-col justify-between"
			>
				<div>
					<h3 class="text-2xl font-bold text-white mb-8 flex items-center gap-3">
						<i class="fas fa-user-check text-indigo-400"></i> Who Qualifies?
					</h3>
					<ul class="space-y-4 mb-8">
						<li class="flex items-start gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
							<i class="fas fa-check-circle text-indigo-400 text-xl mt-0.5 shrink-0"></i>
							<span class="text-slate-300"
								>A current Web2Autos.com customer actively engaged with our services (e.g., inquiry,
								application, or consultation)</span
							>
						</li>
						<li class="flex items-start gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
							<i class="fas fa-check-circle text-indigo-400 text-xl mt-0.5 shrink-0"></i>
							<span class="text-slate-300"
								>A new applicant who submits an application and schedules an appointment with a
								participating dealership</span
							>
						</li>
					</ul>
				</div>
				<button
					@click="store.startApplication"
					class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/20 hover:-translate-y-1"
				>
					Secure Your Appointment Now
				</button>
			</div>
		</div>

		<!-- Disclaimer & Extra Info -->
		<div class="bg-slate-950/50 border border-white/5 rounded-3xl p-8 md:p-12 shadow-inner">
			<h3 class="text-xl font-bold text-white mb-4">The Web2Autos Advantage</h3>
			<p class="text-slate-400 mb-8 leading-relaxed">
				Beyond the opportunity to win, you will also receive personalized support throughout your pre-approval
				journey. Our process leverages advanced tools—including AI-assisted matching and soft credit checks
				(which typically do not impact your credit score)—to give you clarity on your buying power before you
				step into a dealership.
				<strong class="text-indigo-300 font-normal"
					>You’re also welcome to invite friends and family to take advantage of this opportunity!</strong
				>
			</p>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-8">
				<div>
					<h4 class="text-lg font-bold text-white mb-4">Important Information</h4>
					<ul class="space-y-2 text-sm text-slate-400 list-disc list-inside">
						<li>No purchase necessary to enter or win.</li>
						<li>
							Appointment must be scheduled and attended by <strong class="text-white">May 31</strong>.
						</li>
						<li>
							Eligibility requires active engagement with Web2Autos.com or approval as a new applicant.
						</li>
						<li>Winners will be selected at random and notified directly.</li>
						<li>This promotion is not affiliated with or endorsed by any partner dealerships.</li>
						<li>
							Terms and conditions apply. Availability is limited, and appointments are filling quickly.
						</li>
					</ul>
				</div>
				<div class="flex flex-col justify-center space-y-4 text-sm text-slate-300 bg-black/20 p-6 rounded-2xl">
					<p class="text-indigo-400 font-bold text-base mb-2">
						👉 Secure your appointment early to guarantee your entry once the promotion begins.
					</p>
					<p><i class="fas fa-phone-alt w-5 text-center text-slate-500 mr-2"></i> (844) 922-7227</p>
					<p>
						<i class="fas fa-map-marker-alt w-5 text-center text-slate-500 mr-2"></i> 38623 Fremont Blvd.
						Suite 185, Fremont, CA 94536
					</p>
					<p><i class="fas fa-globe w-5 text-center text-slate-500 mr-2"></i> www.web2autos.com</p>
				</div>
			</div>
		</div>
	</div>
</template>
