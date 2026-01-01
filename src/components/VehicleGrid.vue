<script setup lang="ts">
import { useLoanStore } from '@/stores/loan';
import type { Vehicle } from '@/types';

const store = useLoanStore();

const openModal = (vehicle: Vehicle) => {
    store.selectedVehicle = vehicle;
};

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

const handlePageChange = (val: number) => {
    store.currentPage = val;
    // Scroll the internal container to top when page changes
    const scrollContainer = document.getElementById('vehicle-scroll-container');
    if (scrollContainer) scrollContainer.scrollTop = 0;
};

// Handled by store watcher automatically, but we can also force scroll to top here if needed
const handlePageSizeChange = () => {
    const scrollContainer = document.getElementById('vehicle-scroll-container');
    if (scrollContainer) scrollContainer.scrollTop = 0;
};
</script>

<template>
    <!-- Updated Container: Fixed height relative to viewport to enable internal scrolling -->
    <div class="flex flex-col h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)]" id="vehicle-grid-anchor">

        <!-- Header: Fixed at top -->
        <div class="flex-shrink-0 flex flex-col md:flex-row justify-between items-end mb-4 px-1 gap-4">
            <h3 class="text-2xl font-bold text-white drop-shadow-md flex items-center">
                <i class="fas fa-car-side mr-3"></i> Recommended Vehicles
                <span
                    class="ml-3 text-xs bg-white/20 px-2 py-1 rounded text-white border border-white/30 hidden sm:inline-block">
                    {{ store.filterMode === 'budget' ? 'Filtering by Budget' : 'Filtering by Price' }}
                </span>
            </h3>

            <div class="flex flex-col sm:flex-row gap-4 items-end sm:items-center w-full md:w-auto">
                <!-- Sorting -->
                <el-select v-model="store.sortOption" placeholder="Sort by" size="default" class="w-full sm:w-40">
                    <el-option label="Price: Low to High" value="price-asc" />
                    <el-option label="Price: High to Low" value="price-desc" />
                    <el-option label="Year: Newest First" value="year-desc" />
                    <el-option label="Year: Oldest First" value="year-asc" />
                </el-select>

                <!-- NEW: Page Size Filter -->
                <el-select v-model="store.pageSize" placeholder="Show" size="default" class="w-full sm:w-28"
                    @change="handlePageSizeChange">
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

        <!-- Content Area: Flexible and Scrollable -->
        <!-- pb-40 on mobile ensures the last items aren't hidden behind the fixed filter bottom sheet -->
        <div id="vehicle-scroll-container"
            class="flex-1 overflow-y-auto overflow-x-hidden pr-2 lg:pb-0 custom-scrollbar">

            <!-- Empty State -->
            <div v-if="store.filteredVehicles.length === 0">
                <el-card shadow="never" class="border-0">
                    <el-empty
                        description="No vehicles found matching your criteria. Try adjusting the budget or price." />
                </el-card>
            </div>

            <!-- Vehicle Grid -->
            <div v-else>
                <el-row :gutter="24">
                    <el-col v-for="car in store.paginatedVehicles" :key="car.id" :xs="24" :sm="12" :lg="12" :xl="8"
                        class="mb-6">
                        <el-card :body-style="{ padding: '0px' }" shadow="hover"
                            class="vehicle-card h-full flex flex-col cursor-pointer" @click="openModal(car)">
                            <div class="relative h-48 overflow-hidden bg-gray-100">
                                <img :src="car.mediaUrl" alt="Car" loading="lazy"
                                    class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
                                <div
                                    class="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-blue-600 shadow-sm">
                                    {{ car.year }}
                                </div>
                            </div>
                            <div class="p-5 flex flex-col flex-grow">
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-bold text-lg text-gray-800 leading-tight">{{ car.heading }}</h4>
                                </div>

                                <div class="flex items-baseline gap-2 mb-2">
                                    <span class="text-xl font-extrabold text-blue-600">{{ formatCurrency(car.price)
                                    }}</span>
                                    <span class="text-xs text-gray-400 font-semibold"
                                        v-if="store.filterMode === 'budget'">
                                        (~{{ formatCurrency(store.calculatePaymentForPrice(car.price)) }}/mo)
                                    </span>
                                </div>

                                <div class="mt-auto pt-2">
                                    <el-button type="primary" plain class="w-full">
                                        View Details
                                    </el-button>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>

        <!-- Pagination Control: Fixed at bottom of grid area -->
        <div class="flex-shrink-0 pt-4" v-if="store.totalVehicles > 0">
            <div class="flex justify-center bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
                <el-pagination v-model:current-page="store.currentPage" v-model:page-size="store.pageSize"
                    :total="store.totalVehicles" layout="prev, pager, next" background
                    @current-change="handlePageChange" class="glass-pagination" />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Scrollbar Styling */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}

:deep(.glass-pagination .el-pagination__total),
:deep(.glass-pagination .el-pager li),
:deep(.glass-pagination .btn-prev),
:deep(.glass-pagination .btn-next) {
    background-color: rgba(255, 255, 255, 0.9) !important;
    border: none;
    color: #1e3a8a;
    font-weight: bold;
}

:deep(.glass-pagination .el-pager li.is-active) {
    background-color: #2563eb !important;
    color: white;
}
</style>