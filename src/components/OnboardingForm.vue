<script setup lang="ts">
	import { ref, reactive } from 'vue'
	import { useLoanStore } from '@/stores/loan'
	import { ElMessage } from 'element-plus'

	const store = useLoanStore()
	const processing = ref(false)

	const form = reactive({
		budget: null as number | null,
		make: '',
		condition: ''
	})

	const handleRecommend = () => {
		if (!form.budget || form.budget <= 0) {
			ElMessage.error('Please enter a valid budget to continue.')
			return
		}

		processing.value = true
		// Simulate processing time for better UX or wait for fetch if needed
		setTimeout(() => {
			store.applyOnboarding(form.budget, form.make, form.condition)
			processing.value = false
		}, 1500)
	}
</script>

<template>
	<div class="min-h-[80vh] flex flex-col items-center justify-center relative">
		<div
			class="w-full max-w-lg bg-white/10 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-white/20 shadow-2xl relative z-10 animate-[fadeIn_0.5s_ease-out]"
		>
			<div class="text-center mb-8">
				<div
					class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 mb-4 shadow-lg shadow-indigo-500/30"
				>
					<i class="fas fa-car text-2xl text-white"></i>
				</div>
				<h1 class="text-3xl font-bold text-white mb-2">Find your dream car</h1>
				<p class="text-blue-200 text-sm">Tell us what you're looking for, and we'll do the rest.</p>
			</div>

			<div class="space-y-6">
				<!-- Budget -->
				<div class="space-y-2">
					<label class="block text-white text-sm font-bold ml-1">Your Budget (Max Price)</label>
					<el-input
						v-model="form.budget"
						type="number"
						placeholder="e.g. 30000"
						size="large"
						class="!text-lg"
					>
						<template #prefix><i class="fas fa-dollar-sign text-gray-400"></i></template>
					</el-input>
				</div>

				<!-- Make -->
				<div class="space-y-2">
					<label class="block text-white text-sm font-bold ml-1">Favorite Make</label>
					<el-select
						v-model="form.make"
						placeholder="Select Make"
						size="large"
						class="w-full !text-lg"
						filterable
						clearable
					>
						<el-option v-for="m in store.uniqueMakes" :key="m" :label="m" :value="m" />
					</el-select>
				</div>

				<!-- Condition -->
				<div class="space-y-2">
					<label class="block text-white text-sm font-bold ml-1">Condition</label>
					<el-select
						v-model="form.condition"
						placeholder="New or Used"
						size="large"
						class="w-full !text-lg"
						clearable
					>
						<el-option
							v-for="t in store.uniqueInventoryTypes"
							:key="t"
							:label="t.toUpperCase()"
							:value="t"
						/>
					</el-select>
				</div>

				<!-- Buttons -->
				<button
					@click="handleRecommend"
					class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-900/20 transition-all transform active:scale-95 mt-4 flex items-center justify-center gap-2"
				>
					<span v-if="!processing">Show Recommendation</span>
					<span v-else><i class="fas fa-circle-notch animate-spin mr-2"></i> Processing...</span>
				</button>

				<div class="text-center pt-2">
					<button
						@click="store.skipOnboarding"
						class="text-blue-300 hover:text-white text-sm font-medium underline transition-colors"
					>
						Search on my own
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
