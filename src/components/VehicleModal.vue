<script setup lang="ts">
import { computed } from 'vue';
import { useLoanStore } from '@/stores/loan';

const store = useLoanStore();

const dialogVisible = computed({
    get: () => !!store.selectedVehicle,
    set: (val) => { if (!val) store.selectedVehicle = null; }
});

const proceedToConsultant = () => {
    store.startApplication();
};
</script>

<template>
    <el-dialog v-model="dialogVisible" width="95%" class="max-w-2xl rounded-2xl" align-center destroy-on-close>
        <div v-if="store.selectedVehicle">
            <div class="relative h-56 md:h-64 -mx-5 -mt-5 mb-5 overflow-hidden">
                <img :src="store.selectedVehicle.mediaUrl" class="w-full h-full object-cover" loading="lazy">
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-12">
                    <p class="text-2xl md:text-3xl text-white leading-tight">{{
                        store.selectedVehicle.dealer.name }}</p>
                    <h2 class="text-2xl md:text-3xl font-bold text-white leading-tight">{{ store.selectedVehicle.year }}
                        {{ store.selectedVehicle.make }} {{ store.selectedVehicle.model }}</h2>
                    <p class="text-blue-200 font-medium text-sm md:text-base">Stock #{{ store.selectedVehicle.stock_no
                    }}
                    </p>
                </div>
            </div>

            <div class="px-2">
                <div class="flex justify-between items-center mb-6 bg-blue-50 p-4 rounded-xl">
                    <span class="text-gray-600 font-semibold uppercase text-xs tracking-wide">Listing Price</span>
                    <span class="text-2xl md:text-3xl font-bold text-blue-700">$ {{
                        store.selectedVehicle.price.toLocaleString() }}</span>
                </div>

                <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">Description</h4>
                <p class="text-gray-700 leading-relaxed text-base md:text-lg mb-8">{{ store.selectedVehicle.heading }}
                </p>
            </div>
        </div>
        <template #footer>
            <div class="flex flex-col md:flex-row gap-3">
                <el-button @click="dialogVisible = false" size="large" class="w-full md:w-auto">Cancel</el-button>
                <el-button type="primary" @click="proceedToConsultant" size="large" class="w-full md:flex-1">
                    <i class="fas fa-user-tie mr-2"></i> APPLY NOW
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>