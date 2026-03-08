<script setup lang="ts">
	import { computed, ref } from 'vue'
	import { useLoanStore } from '@/stores/loan'
	import { ElMessage } from 'element-plus' // Added ElMessage
	import type { Vehicle } from '@/types'

	const store = useLoanStore()

	const openModal = (vehicle: Vehicle) => {
		store.selectedVehicle = vehicle
		const url = `${window.location.origin}?vehicle_id=${vehicle.id}`
		window.history.replaceState({}, '', url)
	}

	const formatCurrency = (val: number) => {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
			val
		)
	}

	// NEW: Share Function
	const copyLink = (vehicle: Vehicle) => {
		const url = `${window.location.origin}${window.location.pathname}?vehicle_id=${vehicle.id}`
		navigator.clipboard
			.writeText(url)
			.then(() => {
				ElMessage({
					message: 'Vehicle link copied to clipboard!',
					type: 'success',
					duration: 2000
				})
			})
			.catch(() => {
				ElMessage.error('Failed to copy link')
			})
	}

	// Dynamic Header Text Logic
	const headerText = computed(() => {
		const count = store.paginatedVehicles.length
		const total = store.totalVehicles

		const highlight = (str: string) => `<span class="text-indigo-300 font-bold">${str}</span>`

		// 1. Build primary description (e.g. "Used Toyota Camry vehicles")
		const descParts: string[] = []
		if (store.filters.inventoryType) descParts.push(highlight(store.filters.inventoryType))
		if (store.filters.yearRange[0] > 2010 || store.filters.yearRange[1] < 2026) {
			descParts.push(highlight(`${store.filters.yearRange[0]}-${store.filters.yearRange[1]}`))
		}
		if (store.filters.make) descParts.push(highlight(store.filters.make))
		if (store.filters.model) descParts.push(highlight(store.filters.model))
		if (store.filters.trim) descParts.push(highlight(store.filters.trim))
		if (store.filters.bodyType) descParts.push(highlight(store.filters.bodyType))

		const vehicleNoun = descParts.length > 0 ? descParts.join(' ') + ' vehicles' : 'vehicles'

		let text = `Showing ${count}/${total} ${vehicleNoun}`

		if (store.searchQuery && store.searchQuery.trim()) {
			text += ` matching "${highlight(store.searchQuery)}"`
		}

		// 2. Build secondary attributes (e.g. "with Red paint, AWD")
		const secondary: string[] = []
		if (store.filters.fuelType) secondary.push(highlight(store.filters.fuelType))
		if (store.filters.transmission) secondary.push(highlight(store.filters.transmission))
		if (store.filters.drivetrain) secondary.push(highlight(store.filters.drivetrain))
		if (store.filters.exteriorColor) secondary.push(`${highlight(store.filters.exteriorColor)} paint`)
		if (store.filters.dealer) secondary.push(`at ${highlight(store.filters.dealer)}`)

		if (secondary.length > 0) {
			text += ` with ${secondary.join(', ')}`
		}

		if (store.filterMode === 'price') {
			text += ` under ${highlight(formatCurrency(store.price))}`
		} else {
			text += ` fitting ${highlight(formatCurrency(store.monthlyBudget) + '/mo')} budget`
		}
		return text
	})

	const handlePageChange = (val: number) => {
		store.currentPage = val
		const scrollContainer = document.getElementById('vehicle-scroll-container')
		if (scrollContainer) scrollContainer.scrollTop = 0
	}

	const handlePageSizeChange = () => {
		const scrollContainer = document.getElementById('vehicle-scroll-container')
		if (scrollContainer) scrollContainer.scrollTop = 0
	}
</script>

<template>
	<div class="flex flex-col lg:h-[calc(100vh-10rem)] relative" id="vehicle-grid-anchor">
		<div class="mb-6 relative z-30 flex-shrink-0">
			<div class="flex items-center mb-2 ml-1">
				<i class="fas fa-search text-indigo-400 mr-2"></i>
				<label class="text-blue-100 font-bold text-sm uppercase tracking-wider">Search Inventory</label>
			</div>
			<div class="relative group">
				<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
					<i
						class="fas fa-search text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors"
					></i>
				</div>
				<input
					type="text"
					v-model="store.searchQuery"
					class="block w-full pl-12 pr-10 py-4 border border-gray-200 rounded-xl leading-5 bg-white text-slate-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-lg transition-all shadow-lg hover:shadow-xl hover:border-indigo-300"
					placeholder="Search vehicles by make, model, year..."
				/>
				<div
					v-if="store.searchQuery"
					class="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
					@click="store.searchQuery = ''"
				>
					<i class="fas fa-times text-gray-400 hover:text-gray-600 transition-colors"></i>
				</div>
			</div>
		</div>

		<div class="flex-shrink-0 flex flex-col md:flex-row justify-between items-end mb-4 px-1 gap-4">
			<h3 class="text-xl md:text-2xl text-white drop-shadow-md flex items-center leading-tight">
				<i class="fas fa-car-side mr-3 hidden sm:inline-block"></i>
				<span v-html="headerText"></span>
			</h3>

			<div class="hidden sm:flex flex-col sm:flex-row gap-4 items-end sm:items-center w-full md:w-auto">
				<el-select v-model="store.sortOption" placeholder="Sort by" size="default" class="w-full sm:w-40">
					<el-option label="Price: Low to High" value="price-asc" />
					<el-option label="Price: High to Low" value="price-desc" />
					<el-option label="Year: Newest First" value="year-desc" />
					<el-option label="Year: Oldest First" value="year-asc" />
				</el-select>

				<el-select
					v-model="store.pageSize"
					placeholder="Show"
					size="default"
					class="w-full sm:w-28"
					@change="handlePageSizeChange"
				>
					<el-option label="12 / page" :value="12" />
					<el-option label="24 / page" :value="24" />
					<el-option label="48 / page" :value="48" />
					<el-option label="96 / page" :value="96" />
				</el-select>

				<span class="text-blue-200 text-sm font-medium whitespace-nowrap" v-if="store.totalVehicles > 0">
					{{ store.paginatedVehicles.length }} / {{ store.totalVehicles }}
				</span>
			</div>
		</div>

		<div
			id="vehicle-scroll-container"
			class="flex-1 overflow-y-scroll overflow-x-hidden pr-2 lg:pb-0 custom-scrollbar lg:pb-0"
		>
			<div v-if="store.fetchError" class="flex flex-col items-center justify-center py-20">
				<div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
					<i class="fas fa-exclamation-triangle text-3xl text-red-600"></i>
				</div>
				<h3 class="text-xl font-bold text-white mb-2">Connection Error</h3>
				<p class="text-gray-300 mb-6 text-center max-w-md">{{ store.fetchError }}</p>
				<el-button type="primary" size="large" @click="store.fetchInventory(true)">
					<i class="fas fa-sync-alt mr-2"></i> Reload Inventory
				</el-button>
			</div>

			<div v-else-if="store.filteredVehicles.length === 0">
				<el-card shadow="never" class="border-0">
					<el-empty
						description="No vehicles found matching your criteria. Try adjusting the budget or price."
					/>
				</el-card>
			</div>

			<div v-else>
				<el-row :gutter="24">
					<el-col
						v-for="car in store.paginatedVehicles"
						:key="car.id"
						:xs="24"
						:sm="12"
						:md="8"
						:lg="8"
						:xl="8"
						class="mb-6"
					>
						<el-card
							:body-style="{ padding: '0px' }"
							shadow="hover"
							class="vehicle-card h-full flex flex-col cursor-pointer"
							@click="openModal(car)"
						>
							<div class="relative h-48 overflow-hidden bg-gray-100">
								<img
									:src="car.mediaUrls.length ? car.mediaUrls[0] : ''"
									alt="Car"
									loading="lazy"
									class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
								/>
								<div
									class="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-blue-600 shadow-sm"
								>
									{{ car.year }}
								</div>
								<div
									style="top: 0.5rem; right: 3.5rem"
									class="absolute bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-blue-600 shadow-sm"
								>
									{{ car.inventory_type.toLocaleUpperCase() }}
								</div>
							</div>
							<div class="p-5 flex flex-col flex-grow">
								<div class="flex flex-col items-start mb-2">
									<h4 class="text-lg text-gray-800 leading-tight">{{ car.dealer.name }}</h4>
									<h4 class="font-bold text-lg text-gray-800 leading-tight">{{ car.heading }}</h4>
								</div>

								<div class="flex items-baseline gap-2 mb-2">
									<span class="text-xl font-extrabold text-blue-600">{{
										formatCurrency(car.price)
									}}</span>
									<span
										class="text-xs text-gray-400 font-semibold"
										v-if="store.filterMode === 'budget'"
									>
										(~{{ formatCurrency(store.calculatePaymentForPrice(car.price)) }}/mo)
									</span>
								</div>

								<div class="mt-auto pt-2 flex gap-2">
									<el-button type="primary" plain class="flex-1"> View Details </el-button>

									<el-button
										@click.stop="copyLink(car)"
										type="success"
										plain
										class="!px-3"
										title="Copy Link"
									>
										<i class="fas fa-link mr-1"></i> Copy Link
									</el-button>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>
			</div>
		</div>

		<div class="flex-shrink-0 flex justify-center pt-4" v-if="store.totalVehicles > 0">
			<div class="flex justify-center bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
				<el-pagination
					v-model:current-page="store.currentPage"
					v-model:page-size="store.pageSize"
					:total="store.totalVehicles"
					layout="prev, pager, next"
					background
					@current-change="handlePageChange"
					class="glass-pagination"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.5);
		border-radius: 3px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.8);
	}

	.custom-scrollbar {
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
	}

	:deep(.glass-pagination .el-pagination__total),
	:deep(.glass-pagination .el-pager li),
	:deep(.glass-pagination .btn-prev),
	:deep(.glass-pagination .btn-next) {
		background-color: rgba(255, 255, 255, 0.9) !important;
		border: none;
		color: #1e3a8a;
		font-weight: bold;
		border-radius: 50%;
		margin: 0 2px;
	}

	:deep(.glass-pagination .el-pager li.is-active) {
		background-color: #4f46e5 !important;
		color: white;
	}
</style>
