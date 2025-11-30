<script setup lang="ts">
import { onMounted } from 'vue';
import { useLoanStore } from '@/stores/loan';
import LoanInputSection from '@/components/LoanInputSection.vue';
import LoanSummary from '@/components/LoanSummary.vue';
import VehicleGrid from '@/components/VehicleGrid.vue';
import VehicleModal from '@/components/VehicleModal.vue';
import ConsultantForm from '@/components/ConsultantForm.vue';

const store = useLoanStore();

// Trigger the initial fetch for the "1000 rows" when the app mounts
onMounted(() => {
  store.fetchInventory();
});
</script>

<template>
  <div class="app-container">
    <!-- Background Animation Layer -->
    <div class="bg-layer">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <transition name="fade" mode="out-in">
        <div v-if="store.currentView === 'calculator'" key="calc">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column: Inputs -->
            <div class="lg:col-span-2 order-1">
              <LoanInputSection />
            </div>

            <!-- Right Column: Summary (Sticky) -->
            <div class="lg:col-span-1 order-2 lg:order-2">
              <div class="lg:sticky lg:top-4">
                <LoanSummary />
                <el-alert title="Tip" type="info" description="Click on any vehicle to view details and apply."
                  show-icon :closable="false" class="mt-6 hidden lg:flex" />
              </div>
            </div>

            <!-- Bottom Section: Vehicle Grid -->
            <div class="lg:col-span-3 order-3">
              <!-- Optional: Show loading state here or inside grid component -->
              <div v-if="store.isFetchingVehicles" class="py-10 text-center">
                <el-skeleton :rows="3" animated />
                <p class="text-blue-200 mt-4">Loading vehicle inventory...</p>
              </div>
              <VehicleGrid v-else />
            </div>
          </div>
          <VehicleModal />
        </div>

        <div v-else-if="store.currentView === 'application'" key="app">
          <ConsultantForm />
        </div>
      </transition>

      <!-- Scroll To Top Button -->
      <el-backtop :right="30" :bottom="30"
        class="!bg-indigo-600 !text-white !shadow-xl hover:!bg-indigo-700 transition-colors !w-12 !h-12">
        <i class="fas fa-arrow-up font-bold text-lg"></i>
      </el-backtop>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  padding: 1rem;
}

@media (min-width: 768px) {
  .app-container {
    padding: 2rem;
  }
}
</style>