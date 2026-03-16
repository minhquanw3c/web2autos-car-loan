<script setup lang="ts">
	// Example Vimeo Video URL (Replace with your actual video ID)
	const vimeoSrc = 'https://player.vimeo.com/video/1131989201'
</script>

<template>
	<div class="relative mb-24 -mx-4 sm:-mx-6 lg:-mx-8 py-16 md:py-24 overflow-hidden">
		<!-- Immersive Background -->
		<div class="absolute inset-0 bg-white">
			<div class="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-white z-10"></div>
			<!-- Abstract Shapes -->
			<div
				class="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"
			></div>
			<div
				class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"
			></div>
		</div>

		<div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
				<!-- Text Content -->
				<div class="w-full lg:w-5/12 text-center lg:text-left space-y-6">
					<div
						class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 backdrop-blur-sm"
					>
						<span class="relative flex h-2 w-2">
							<span
								class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"
							></span>
							<span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
						</span>
						<span class="text-indigo-700 text-xs font-bold uppercase tracking-widest">Video Tour</span>
					</div>

					<h2 class="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
						See the <span class="text-indigo-600">Future</span> of <br />
						Auto Financing
					</h2>

					<p class="text-lg text-slate-600 leading-relaxed">
						Experience a seamless, transparent, and digital-first approach to buying your next car. Watch
						how we get you approved in minutes, not hours.
					</p>

					<div class="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
						<div class="flex items-center gap-2 text-sm text-slate-600 font-medium">
							<i class="fas fa-check-circle text-green-500"></i> <span>Instant Approval</span>
						</div>
						<div class="flex items-center gap-2 text-sm text-slate-600 font-medium">
							<i class="fas fa-check-circle text-green-500"></i> <span>No Hidden Fees</span>
						</div>
					</div>
				</div>

				<!-- Video Player -->
				<div class="w-full lg:w-7/12">
					<div class="relative group">
						<!-- Glow Effect behind player -->
						<div
							class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"
						></div>

						<div
							class="relative w-full pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-gray-200"
						>
							<iframe
								:src="`${vimeoSrc}?title=0&byline=0&portrait=0`"
								class="absolute top-0 left-0 w-full h-full"
								frameborder="0"
								allow="autoplay; fullscreen; picture-in-picture"
								allowfullscreen
							></iframe>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
