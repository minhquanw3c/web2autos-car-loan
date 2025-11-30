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
    // Optional: Scroll to top of grid when page changes
    const gridTop = document.getElementById('vehicle-grid-anchor');
    if (gridTop) gridTop.scrollIntoView({ behavior: 'smooth' });
};
</script>

<template>
    <div class="mt-10" id="vehicle-grid-anchor">
        <div class="flex flex-col md:flex-row justify-between items-end mb-6 px-1">
            <h3 class="text-2xl font-bold text-white drop-shadow-md flex items-center">
                <i class="fas fa-car-side mr-3"></i> Recommended Vehicles
            </h3>
            <span class="text-blue-200 text-sm font-medium mb-1 md:mb-0" v-if="store.totalVehicles > 0">
                Showing {{ store.paginatedVehicles.length }} of {{ store.totalVehicles }} matches
            </span>
        </div>

        <!-- Empty State -->
        <div v-if="store.filteredVehicles.length === 0">
            <el-card shadow="never" class="border-0">
                <el-empty description="No vehicles found in this price range. Try adjusting your vehicle price." />
            </el-card>
        </div>

        <!-- Vehicle Grid -->
        <div v-else>
            <el-row :gutter="24">
                <el-col v-for="car in store.paginatedVehicles" :key="car.id" :xs="24" :sm="12" :lg="8" class="mb-6">
                    <el-card :body-style="{ padding: '0px' }" shadow="hover"
                        class="vehicle-card h-full flex flex-col cursor-pointer" @click="openModal(car)">
                        <div class="relative h-48 overflow-hidden bg-gray-100">
                            <img :src="car.img" alt="Car"
                                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
                            <div
                                class="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-blue-600 shadow-sm">
                                {{ car.year }}
                            </div>
                        </div>
                        <div class="p-5 flex flex-col flex-grow">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-bold text-lg text-gray-800 leading-tight">{{ car.make }} {{ car.model }}
                                </h4>
                            </div>
                            <div class="text-xl font-extrabold text-blue-600 mb-2">{{ formatCurrency(car.price) }}</div>
                            <p class="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">{{ car.desc }}</p>

                            <div class="mt-auto pt-2">
                                <el-button type="primary" plain class="w-full">
                                    View Details
                                </el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <!-- Pagination Control -->
            <div class="flex justify-center mt-8 pb-4">
                <el-pagination v-model:current-page="store.currentPage" v-model:page-size="store.pageSize"
                    :total="store.totalVehicles" layout="prev, pager, next" background
                    @current-change="handlePageChange" class="glass-pagination" />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Custom style to make pagination fit the dark glass theme */
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