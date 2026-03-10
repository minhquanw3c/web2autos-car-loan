<script setup lang="ts">
	import { ref } from 'vue'
	import { useLoanStore } from '@/stores/loan'

	const store = useLoanStore()
	const isMobileMenuOpen = ref(false)
</script>

<template>
	<div
		class="fixed right-0 top-1/2 -translate-y-1/2 z-[3000] lg:hidden transition-transform duration-300 ease-in-out"
		:class="isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'"
	>
		<button
			@click="isMobileMenuOpen = !isMobileMenuOpen"
			class="absolute right-full top-1/2 -translate-y-1/2 w-12 h-14 bg-slate-900/90 backdrop-blur-lg rounded-l-2xl border-y border-l border-white/20 shadow-[-4px_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center text-indigo-400 hover:text-white transition-colors"
		>
			<i :class="isMobileMenuOpen ? 'fas fa-chevron-right' : 'fas fa-chevron-left text-2xl animate-pulse'"></i>
		</button>
		<div
			class="flex flex-col gap-4 p-4 bg-slate-900/90 backdrop-blur-lg border-y border-l border-white/20 shadow-2xl rounded-l-2xl min-w-[80px] items-center"
		>
			<button
				@click="
					() => {
						store.resetView()
						isMobileMenuOpen = false
					}
				"
				class="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg border border-indigo-500/30"
				title="Home"
			>
				<i class="fas fa-home"></i>
			</button>
			<button
				@click="
					() => {
						store.goToInventory()
						isMobileMenuOpen = false
					}
				"
				class="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg border border-indigo-500/30"
				title="Inventory"
			>
				<i class="fas fa-car"></i>
			</button>
			<button
				@click="
					() => {
						store.startApplication()
						isMobileMenuOpen = false
					}
				"
				class="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg border border-indigo-500/30"
				title="Apply Now"
			>
				<i class="fas fa-file-signature"></i>
			</button>
			<button
				@click="
					() => {
						store.goToContact()
						isMobileMenuOpen = false
					}
				"
				class="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg border border-indigo-500/30"
				title="Contact"
			>
				<i class="fas fa-envelope"></i>
			</button>
			<button
				@click="
					() => {
						store.goToDealershipInquiry()
						isMobileMenuOpen = false
					}
				"
				class="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg border border-indigo-500/30"
				title="For Dealers"
			>
				<i class="fas fa-handshake"></i>
			</button>
		</div>
	</div>
</template>
