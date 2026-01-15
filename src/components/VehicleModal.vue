<script setup lang="ts">
	import { computed, ref, watch } from 'vue'
	import { useLoanStore } from '@/stores/loan'

	const store = useLoanStore()
	const activeTab = ref('overview')
	const currentImageIndex = ref(0)

	const dialogVisible = computed({
		get: () => !!store.selectedVehicle,
		set: (val) => {
			if (!val) store.selectedVehicle = null
		}
	})

	// Reset gallery when modal opens
	watch(
		() => store.selectedVehicle,
		() => {
			currentImageIndex.value = 0
			activeTab.value = 'overview'
		}
	)

	const proceedToConsultant = () => {
		// Keep selectedVehicle set so the form can read it
		store.startApplication()
	}

	const formatCurrency = (val: number) => {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
			val
		)
	}

	const formatNumber = (val: number) => {
		return new Intl.NumberFormat('en-US').format(val)
	}

	const selectImage = (index: number) => {
		currentImageIndex.value = index
	}
</script>

<template>
	<el-dialog
		v-model="dialogVisible"
		width="95%"
		class="max-w-6xl rounded-2xl vehicle-modal"
		align-center
		destroy-on-close
		:show-close="true"
		append-to-body
	>
		<div
			v-if="store.selectedVehicle"
			class="flex flex-col lg:flex-row h-full lg:h-[80vh] overflow-hidden -m-4 sm:-m-6"
		>
			<div class="w-full lg:w-3/5 bg-gray-900 flex flex-col h-[40vh] lg:h-full relative group">
				<div class="flex-1 relative overflow-hidden flex items-center justify-center bg-black">
					<img
						v-if="store.selectedVehicle.mediaUrls && store.selectedVehicle.mediaUrls.length > 0"
						:src="store.selectedVehicle.mediaUrls[currentImageIndex]"
						class="w-full h-full object-contain transition-opacity duration-300"
					/>
					<div v-else class="text-white text-opacity-50 flex flex-col items-center">
						<i class="fas fa-image text-4xl mb-2"></i>
						<span>No Image Available</span>
					</div>

					<div
						class="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
					>
						<button
							v-if="store.selectedVehicle.mediaUrls.length > 1"
							@click.stop="
								currentImageIndex =
									currentImageIndex > 0
										? currentImageIndex - 1
										: store.selectedVehicle.mediaUrls.length - 1
							"
							class="pointer-events-auto bg-black/50 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/80 transition"
						>
							<i class="fas fa-chevron-left"></i>
						</button>
						<button
							v-if="store.selectedVehicle.mediaUrls.length > 1"
							@click.stop="
								currentImageIndex =
									currentImageIndex < store.selectedVehicle.mediaUrls.length - 1
										? currentImageIndex + 1
										: 0
							"
							class="pointer-events-auto bg-black/50 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/80 transition"
						>
							<i class="fas fa-chevron-right"></i>
						</button>
					</div>
				</div>

				<div
					v-if="store.selectedVehicle.mediaUrls && store.selectedVehicle.mediaUrls.length > 1"
					class="h-20 bg-gray-900 border-t border-gray-800 p-2 flex gap-2 overflow-x-auto custom-scrollbar flex-shrink-0"
				>
					<div
						v-for="(img, idx) in store.selectedVehicle.mediaUrls"
						:key="idx"
						@click="selectImage(idx)"
						class="h-full aspect-[4/3] rounded overflow-hidden cursor-pointer border-2 transition-all relative flex-shrink-0"
						:class="
							idx === currentImageIndex
								? 'border-indigo-500 opacity-100'
								: 'border-transparent opacity-60 hover:opacity-100'
						"
					>
						<img :src="img" class="w-full h-full object-cover" />
					</div>
				</div>
			</div>

			<div class="w-full lg:w-2/5 flex flex-col bg-white h-auto lg:h-full overflow-hidden">
				<div class="p-6 border-b border-gray-100 flex-shrink-0">
					<div class="flex justify-between items-start mb-2">
						<div>
							<h2 class="text-2xl font-bold text-gray-900 leading-tight">
								{{ store.selectedVehicle.year }} {{ store.selectedVehicle.make }}
								{{ store.selectedVehicle.model }}
							</h2>
							<p class="text-gray-500 text-sm font-medium">
								{{ store.selectedVehicle.trim }} {{ store.selectedVehicle.body_type }}
							</p>
						</div>
						<div class="text-right">
							<div class="text-3xl font-extrabold text-indigo-600">
								{{ formatCurrency(store.selectedVehicle.price) }}
							</div>
							<div
								v-if="store.selectedVehicle.price_change_percent < 0"
								class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded inline-block mt-1"
							>
								📉 {{ store.selectedVehicle.price_change_percent }}% Price Drop
							</div>
						</div>
					</div>

					<div class="flex items-center gap-4 text-sm text-gray-600 mt-3">
						<span class="flex items-center"
							><i class="fas fa-map-marker-alt text-gray-400 mr-1.5"></i>
							{{ store.selectedVehicle.dealer.street }}</span
						>
						<span class="flex items-center"
							><i class="fas fa-tag text-gray-400 mr-1.5"></i> Stock #:
							{{ store.selectedVehicle.stock_no }}</span
						>
					</div>
				</div>

				<div class="flex-1 overflow-y-auto custom-content-scroll bg-gray-50/50">
					<el-tabs v-model="activeTab" class="custom-tabs px-6">
						<el-tab-pane label="Overview" name="overview">
							<div class="py-4 space-y-6">
								<div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
									<h3
										class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center"
									>
										<i class="fas fa-search text-indigo-500 mr-2"></i> Key Details
									</h3>
									<div class="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
										<div>
											<span class="block text-gray-400 text-xs mb-0.5">Mileage</span>
											<span class="font-semibold text-gray-800"
												>{{ formatNumber(store.selectedVehicle.miles) }} miles</span
											>
										</div>
										<div>
											<span class="block text-gray-400 text-xs mb-0.5">Engine</span>
											<span class="font-semibold text-gray-800">{{
												store.selectedVehicle.engine
											}}</span>
										</div>
										<div>
											<span class="block text-gray-400 text-xs mb-0.5">Transmission</span>
											<span class="font-semibold text-gray-800">{{
												store.selectedVehicle.transmission
											}}</span>
										</div>
										<div>
											<span class="block text-gray-400 text-xs mb-0.5">Drivetrain</span>
											<span class="font-semibold text-gray-800">{{
												store.selectedVehicle.drivetrain
											}}</span>
										</div>
										<div>
											<span class="block text-gray-400 text-xs mb-0.5">Fuel Economy</span>
											<span class="font-semibold text-gray-800">
												{{ store.selectedVehicle.city_mpg }} City /
												{{ store.selectedVehicle.highway_mpg }} Hwy
											</span>
										</div>
										<div>
											<span class="block text-gray-400 text-xs mb-0.5">Seats</span>
											<span class="font-semibold text-gray-800">{{
												store.selectedVehicle.std_seating
											}}</span>
										</div>
									</div>
								</div>

								<div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
									<h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
										Colors
									</h3>
									<div class="grid grid-cols-2 gap-4">
										<div class="flex items-center gap-3">
											<div
												class="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
												:style="{
													backgroundColor: store.selectedVehicle.base_ext_color || '#ccc'
												}"
											></div>
											<div>
												<span class="block text-xs text-gray-400">Exterior</span>
												<span class="text-sm font-medium">{{
													store.selectedVehicle.exterior_color
												}}</span>
											</div>
										</div>
										<div class="flex items-center gap-3">
											<div
												class="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
												:style="{
													backgroundColor: store.selectedVehicle.base_int_color || '#333'
												}"
											></div>
											<div>
												<span class="block text-xs text-gray-400">Interior</span>
												<span class="text-sm font-medium">{{
													store.selectedVehicle.interior_color
												}}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</el-tab-pane>

						<el-tab-pane label="Market & Specs" name="specs">
							<div class="py-4 space-y-6">
								<div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
									<h3
										class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center"
									>
										<i class="fas fa-chart-line text-indigo-500 mr-2"></i> Market Info
									</h3>
									<div class="space-y-3 text-sm">
										<div class="flex justify-between items-center py-2 border-b border-gray-50">
											<span class="text-gray-500">Original MSRP</span>
											<span class="font-semibold text-gray-900">{{
												formatCurrency(store.selectedVehicle.msrp)
											}}</span>
										</div>
										<div class="flex justify-between items-center py-2 border-b border-gray-50">
											<span class="text-gray-500">Days on Market</span>
											<span class="font-semibold text-gray-900"
												>{{ store.selectedVehicle.dom }} days</span
											>
										</div>
										<div class="flex justify-between items-center py-2">
											<span class="text-gray-500">Source</span>
											<span class="font-semibold text-gray-900 capitalize">{{
												store.selectedVehicle.source
											}}</span>
										</div>
									</div>
								</div>

								<div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
									<h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
										Technical Specs
									</h3>
									<div class="grid grid-cols-2 gap-y-3 text-sm">
										<div class="col-span-2 sm:col-span-1">
											<span class="text-gray-400 mr-2">Engine:</span>
											<span class="font-medium"
												>{{ store.selectedVehicle.engine_size }}
												{{ store.selectedVehicle.engine_block }}</span
											>
										</div>
										<div class="col-span-2 sm:col-span-1">
											<span class="text-gray-400 mr-2">Cylinders:</span>
											<span class="font-medium">{{ store.selectedVehicle.cylinders }}</span>
										</div>
										<div class="col-span-2 sm:col-span-1">
											<span class="text-gray-400 mr-2">Fuel Type:</span>
											<span class="font-medium">{{ store.selectedVehicle.fuel_type }}</span>
										</div>
										<div class="col-span-2 sm:col-span-1">
											<span class="text-gray-400 mr-2">Body:</span>
											<span class="font-medium">{{ store.selectedVehicle.body_type }}</span>
										</div>
										<div class="col-span-2 sm:col-span-1">
											<span class="text-gray-400 mr-2">Doors:</span>
											<span class="font-medium">{{ store.selectedVehicle.doors }}</span>
										</div>
										<div class="col-span-2 sm:col-span-1">
											<span class="text-gray-400 mr-2">Inventory Type:</span>
											<span class="font-medium capitalize">{{
												store.selectedVehicle.inventory_type
											}}</span>
										</div>
										<div class="col-span-2 sm:col-span-1">
											<span class="text-gray-400 mr-2">Dimensions:</span>
											<span class="font-medium"
												>{{ store.selectedVehicle.overall_height }}" H x
												{{ store.selectedVehicle.overall_width }}" W</span
											>
										</div>
									</div>
								</div>

								<div class="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
									<h3 class="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2">
										Dealer Information
									</h3>
									<p class="font-bold text-lg text-slate-800">
										{{ store.selectedVehicle.dealer.name }}
									</p>
									<p class="text-sm text-slate-500 mb-3">
										{{ store.selectedVehicle.dealer.street }} -
										{{ store.selectedVehicle.dealer.dealer_type }}
									</p>
									<a
										:href="store.selectedVehicle.referenceUrl"
										target="_blank"
										class="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-1"
									>
										View on Dealer Website <i class="fas fa-external-link-alt ml-1 text-xs"></i>
									</a>
								</div>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>

				<div class="p-6 bg-white border-t border-gray-100 flex-shrink-0 flex flex-col sm:flex-row gap-4">
					<button
						@click="dialogVisible = false"
						class="px-6 py-3.5 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors w-full sm:w-auto"
					>
						Close
					</button>
					<button
						@click="proceedToConsultant"
						class="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transform active:scale-95 transition-all flex items-center justify-center gap-2"
					>
						<i class="fa-pen-to-square fas"></i> Apply now
					</button>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<style scoped>
	/* Scoped overrides for Element Plus Tabs to match the design */
	:deep(.el-tabs__nav-wrap::after) {
		background-color: transparent;
	}
	:deep(.el-tabs__item) {
		font-size: 15px;
		font-weight: 600;
		color: #64748b;
	}
	:deep(.el-tabs__item.is-active) {
		color: #4f46e5; /* Indigo 600 */
	}
	:deep(.el-tabs__active-bar) {
		background-color: #4f46e5;
		height: 3px;
		border-radius: 3px;
	}

	/* Custom Scrollbar for image list */
	.custom-scrollbar::-webkit-scrollbar {
		height: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #4b5563;
		border-radius: 2px;
	}

	/* Custom Scrollbar for content area */
	.custom-content-scroll::-webkit-scrollbar {
		width: 6px;
	}
	.custom-content-scroll::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 3px;
	}
</style>
