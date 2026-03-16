<script setup lang="ts">
	import { useLoanStore } from '@/stores/loan'

	const store = useLoanStore()
	const emit = defineEmits(['action'])

	const handleAction = () => {
		emit('action')

		const innerScroll = document.getElementById('vehicle-scroll-container')
		if (innerScroll) {
			innerScroll.scrollTo({ top: 0, behavior: 'smooth' })
		}

		const anchor = document.getElementById('vehicle-grid-anchor')
		if (anchor) {
			const headerOffset = 100 // Account for sticky header
			const elementPosition = anchor.getBoundingClientRect().top
			const offsetPosition = elementPosition + window.scrollY - headerOffset
			window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
		} else {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}
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

		<div class="flex flex-col gap-6 p-2">
			<div class="block sm:hidden space-y-4 border-b border-gray-200 pb-4">
				<div class="space-y-1">
					<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Sort Results</label>
					<el-select v-model="store.sortOption" placeholder="Sort by" class="w-full" @change="handleAction">
						<el-option label="Price: Low to High" value="price-asc" />
						<el-option label="Price: High to Low" value="price-desc" />
						<el-option label="Year: Newest First" value="year-desc" />
						<el-option label="Year: Oldest First" value="year-asc" />
					</el-select>
				</div>

				<div class="space-y-1">
					<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Items Per Page</label>
					<el-select v-model="store.pageSize" placeholder="Show" class="w-full" @change="handleAction">
						<el-option label="12 / page" :value="12" />
						<el-option label="24 / page" :value="24" />
						<el-option label="48 / page" :value="48" />
						<el-option label="96 / page" :value="96" />
					</el-select>
				</div>
			</div>

			<div class="space-y-1">
				<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Dealership</label>
				<el-select v-model="store.filters.dealer" placeholder="All Dealers" clearable class="w-full">
					<el-option v-for="dealer in store.uniqueDealers" :key="dealer" :label="dealer" :value="dealer" />
				</el-select>
			</div>

			<div class="space-y-1">
				<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Make</label>
				<el-select v-model="store.filters.make" placeholder="All Makes" clearable class="w-full" size="default">
					<el-option v-for="make in store.uniqueMakes" :key="make" :label="make" :value="make" />
				</el-select>
			</div>

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

			<div class="space-y-1">
				<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Trim</label>
				<el-select
					v-model="store.filters.trim"
					placeholder="Any Trim"
					clearable
					class="w-full"
					:disabled="!store.filters.model"
				>
					<el-option v-for="trim in store.uniqueTrims" :key="trim" :label="trim" :value="trim" />
				</el-select>
			</div>

			<div class="space-y-1">
				<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Condition</label>
				<el-select v-model="store.filters.inventoryType" placeholder="New / Used" clearable class="w-full">
					<el-option
						v-for="type in store.uniqueInventoryTypes"
						:key="type"
						:label="type.toUpperCase()"
						:value="type"
					/>
				</el-select>
			</div>

			<div class="space-y-2">
				<div class="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wide">
					<span>Year</span>
					<span class="text-indigo-600"
						>{{ store.filters.yearRange[0] }} - {{ store.filters.yearRange[1] }}</span
					>
				</div>
				<el-slider v-model="store.filters.yearRange" range :min="2010" :max="2026" :step="1" size="small" />
			</div>

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

			<div class="space-y-1">
				<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Body Type</label>
				<el-select v-model="store.filters.bodyType" placeholder="Any" clearable class="w-full">
					<el-option v-for="type in store.uniqueBodyTypes" :key="type" :label="type" :value="type" />
				</el-select>
			</div>

			<div class="space-y-1">
				<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Transmission</label>
				<el-select v-model="store.filters.transmission" placeholder="Any" clearable class="w-full">
					<el-option v-for="trans in store.uniqueTransmissions" :key="trans" :label="trans" :value="trans" />
				</el-select>
			</div>

			<div class="space-y-1">
				<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Drivetrain</label>
				<el-select v-model="store.filters.drivetrain" placeholder="Any" clearable class="w-full">
					<el-option v-for="drive in store.uniqueDrivetrains" :key="drive" :label="drive" :value="drive" />
				</el-select>
			</div>

			<div class="space-y-1">
				<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Fuel Type</label>
				<el-select v-model="store.filters.fuelType" placeholder="Any" clearable class="w-full">
					<el-option v-for="fuel in store.uniqueFuelTypes" :key="fuel" :label="fuel" :value="fuel" />
				</el-select>
			</div>

			<div class="space-y-1">
				<label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Exterior Color</label>
				<el-select v-model="store.filters.exteriorColor" placeholder="Any" clearable class="w-full">
					<el-option v-for="color in store.uniqueColors" :key="color" :label="color" :value="color" />
				</el-select>
			</div>
		</div>
	</el-card>
</template>
