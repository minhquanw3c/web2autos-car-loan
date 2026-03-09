<script setup lang="ts">
	defineProps({
		visible: {
			type: Boolean,
			default: false
		},
		text: {
			type: String,
			default: 'Loading...'
		}
	})
</script>

<template>
	<div
		v-if="visible"
		class="fixed inset-0 z-[9999] bg-slate-900 flex flex-col items-center justify-center opacity-90 transition-opacity duration-300"
	>
		<div class="animate-pulse mb-6">
			<img src="/logo_01.png" alt="Web2Autos" class="h-24 w-auto object-contain" />
		</div>
		<div class="flex items-center gap-3">
			<div class="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
			<span class="text-white font-medium tracking-wide">{{ text }}</span>
		</div>
	</div>
</template>
