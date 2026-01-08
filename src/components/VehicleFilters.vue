<script setup lang="ts">
	import { useLoanStore } from '@/stores/loan'

	const store = useLoanStore()
</script>

<template>
	<el-card shadow="hover" class="rounded-xl border border-white/50 bg-white/80 backdrop-blur-md">
		<template #header>
			<div class="flex justify-between items-center">
				<div class="flex items-center text-lg font-bold text-gray-800">
					<i class="fas fa-filter text-indigo-500 mr-2"></i>
					<span>Filters</span>
				</div>
				<button
					@click="store.resetFilters"
					class="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline"
				>
					Reset
				</button>
			</div>
		</template>

		<!-- Changed to Vertical Layout (Stack) -->
		<div class="flex flex-col gap-6 p-2">
			<!-- Make -->
			<div class="space-y-1">
				<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Make</label>
				<el-select v-model="store.filters.make" placeholder="All Makes" clearable class="w-full" size="default">
					<el-option v-for="make in store.uniqueMakes" :key="make" :label="make" :value="make" />
				</el-select>
			</div>

			<!-- Model -->
			<div class="space-y-1">
				<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Model</label>
				<el-select
					v-model="store.filters.model"
					placeholder="All Models"
					clearable
					class="w-full"
					:disabled="!store.filters.make"
				>
					<el-option v-for="model in store.uniqueModels" :key="model" :label="model" :value="model" />
				</el-select>
			</div>

			<!-- Year Range -->
			<div class="space-y-2">
				<div class="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wide">
					<span>Year</span>
					<span class="text-indigo-600"
						>{{ store.filters.yearRange[0] }} - {{ store.filters.yearRange[1] }}</span
					>
				</div>
				<el-slider v-model="store.filters.yearRange" range :min="2010" :max="2026" :step="1" size="small" />
			</div>

			<!-- Mileage Range -->
			<div class="space-y-2">
				<div class="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wide">
					<span>Mileage</span>
					<span class="text-indigo-600"
						>{{ (store.filters.mileageRange[0] / 1000).toFixed(0) }}k -
						{{ (store.filters.mileageRange[1] / 1000).toFixed(0) }}k+</span
					>
				</div>
				<el-slider
					v-model="store.filters.mileageRange"
					range
					:min="0"
					:max="200000"
					:step="10000"
					size="small"
				/>
			</div>

			<!-- Body Type -->
			<div class="space-y-1">
				<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Body Type</label>
				<el-select v-model="store.filters.bodyType" placeholder="Any" clearable class="w-full">
					<el-option v-for="type in store.uniqueBodyTypes" :key="type" :label="type" :value="type" />
				</el-select>
			</div>

			<!-- Fuel Type -->
			<div class="space-y-1">
				<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Fuel Type</label>
				<el-select v-model="store.filters.fuelType" placeholder="Any" clearable class="w-full">
					<el-option v-for="fuel in store.uniqueFuelTypes" :key="fuel" :label="fuel" :value="fuel" />
				</el-select>
			</div>

			<!-- Exterior Color -->
			<div class="space-y-1">
				<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Exterior Color</label>
				<el-select v-model="store.filters.exteriorColor" placeholder="Any" clearable class="w-full">
					<el-option v-for="color in store.uniqueColors" :key="color" :label="color" :value="color" />
				</el-select>
			</div>
		</div>
	</el-card>
</template>
