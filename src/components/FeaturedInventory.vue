<script setup lang="ts">
	import { computed } from 'vue'
	import { useLoanStore } from '@/stores/loan'
	import { ElMessage } from 'element-plus'
	import type { Vehicle } from '@/types'

	const store = useLoanStore()

	// Group vehicles by dealership and take up to 4 per dealer
	const dealershipGroups = computed(() => {
		const groups: Record<string, Vehicle[]> = {}

		store.inventory.forEach((vehicle) => {
			const dealerName = vehicle.dealer?.name || 'Other Dealerships'
			if (!groups[dealerName]) {
				groups[dealerName] = []
			}
			if (groups[dealerName].length < 4) {
				groups[dealerName].push(vehicle)
			}
		})

		// Convert to array and limit to top 4 dealers so the homepage doesn't get too long
		return Object.entries(groups)
			.map(([name, vehicles]) => ({ name, vehicles }))
			.filter((group) => group.vehicles.length > 0)
			.slice(0, 4)
	})

	const formatCurrency = (val: number) => {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
			val
		)
	}

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

	const viewVehicle = (vehicle: Vehicle) => {
		store.selectedVehicle = vehicle
		const url = new URL(window.location.href)
		url.searchParams.set('vehicle_id', vehicle.id)
		url.searchParams.set('showInventory', 'true')
		window.history.pushState({}, '', url.toString())
		store.goToInventory()
	}

	const viewDealerInventory = (dealerName: string) => {
		store.resetFilters()
		// store.filters.dealer = dealerName
		store.goToInventory()
	}

	// Dynamic styling based on index to differentiate sections
	const getSectionClass = (index: number) => {
		const styles = [
			'bg-slate-800/40 border-white/5', // Dark slate glass
			'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/20', // Indigo gradient
			'bg-slate-900/80 border-slate-700', // Solid dark
			'bg-blue-900/20 border-blue-500/20' // Blue tinted
		]
		return styles[index % styles.length]
	}
</script>

<template>
	<div v-if="dealershipGroups.length > 0" class="mb-24 space-y-12">
		<div class="text-center mb-8">
			<h2 class="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">Featured Dealerships</h2>
			<p class="text-blue-200 text-lg max-w-2xl mx-auto">Check out some of our new arrivals.</p>
		</div>

		<div
			v-for="(group, index) in dealershipGroups"
			:key="group.name"
			:class="['rounded-3xl p-6 md:p-10 border backdrop-blur-sm shadow-xl', getSectionClass(index)]"
		>
			<div class="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-white/10 pb-4">
				<div>
					<h3 class="text-2xl md:text-3xl font-bold text-white mb-2">{{ group.name }}</h3>
				</div>
				<button
					@click="viewDealerInventory(group.name)"
					class="text-white hover:text-indigo-300 font-bold text-sm transition-colors flex items-center gap-2"
				>
					View All Inventory <i class="fas fa-arrow-right"></i>
				</button>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<el-card
					v-for="car in group.vehicles"
					:key="car.id"
					:body-style="{ padding: '0px', height: '100%', display: 'flex', flexDirection: 'column' }"
					shadow="hover"
					class="vehicle-card h-full flex flex-col cursor-pointer border-0 bg-white/95 hover:-translate-y-1 transition-transform duration-300"
					@click="viewVehicle(car)"
				>
					<div class="relative h-48 overflow-hidden bg-gray-200 shrink-0">
						<img
							:src="car.mediaUrls.length ? car.mediaUrls[0] : ''"
							alt="Car"
							loading="lazy"
							class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
						/>
						<div
							class="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-indigo-600 shadow-sm"
						>
							{{ car.year }}
						</div>
						<div
							style="top: 0.5rem; right: 3.5rem"
							class="absolute bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-indigo-600 shadow-sm"
						>
							{{ car.inventory_type.toLocaleUpperCase() }}
						</div>
					</div>
					<div class="p-5 flex flex-col flex-grow">
						<div class="flex flex-col items-start mb-2">
							<h4 class="font-bold text-lg text-slate-800 leading-tight line-clamp-2">
								{{ car.heading }}
							</h4>
							<p class="text-sm text-slate-500 mt-1">{{ car.miles?.toLocaleString() || 0 }} miles</p>
						</div>

						<div class="flex items-baseline gap-2 mb-4 mt-auto pt-2">
							<span class="text-xl font-extrabold text-indigo-600">{{ formatCurrency(car.price) }}</span>
							<span class="text-xs text-slate-500 font-semibold" v-if="store.filterMode === 'budget'">
								(~{{ formatCurrency(store.calculatePaymentForPrice(car.price)) }}/mo)
							</span>
						</div>

						<div class="mt-auto flex gap-2">
							<el-button
								type="primary"
								class="flex-1 !bg-indigo-600 !border-indigo-600 hover:!bg-indigo-700"
							>
								View Details
							</el-button>
							<el-button
								@click.stop="copyLink(car)"
								plain
								class="!px-3 !text-indigo-600 !border-indigo-200 hover:!bg-indigo-50"
								title="Copy Link"
							>
								<i class="fas fa-link"></i>
							</el-button>
						</div>
					</div>
				</el-card>
			</div>
		</div>
	</div>

	<div v-else-if="store.isFetchingVehicles" class="mb-24 text-center py-12">
		<div
			class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
		></div>
		<p class="text-slate-400">Loading featured vehicles...</p>
	</div>
</template>
