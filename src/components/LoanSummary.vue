<script setup lang="ts">
import { useLoanStore } from '@/stores/loan';

const store = useLoanStore();

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
};
</script>

<template>
    <el-card class="summary-card shadow-xl top-4" :body-style="{ padding: '0px' }">
        <div class="p-6 text-white">
            <p class="text-blue-100 text-xs uppercase tracking-wider font-bold mb-1">Estimated Monthly Payment</p>
            <h2 class="text-4xl md:text-5xl font-bold mb-4">{{ formatCurrency(store.monthlyPayment) }}</h2>

            <div class="border-t border-blue-400/30 pt-4 space-y-2 text-sm text-blue-50">
                <div class="flex justify-between">
                    <span>Vehicle Price:</span>
                    <span class="font-semibold">{{ formatCurrency(store.price) }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Loan Term:</span>
                    <span class="font-semibold">{{ store.loanTerm }} Months</span>
                </div>
                <div class="flex justify-between">
                    <span>Interest Rate:</span>
                    <span class="font-semibold">{{ store.interestRate }}%</span>
                </div>
                <div class="flex justify-between" v-if="store.netTradeImpact !== 0">
                    <span>Trade-in Impact:</span>
                    <span :class="store.netTradeImpact > 0 ? 'text-green-300' : 'text-red-300'" class="font-semibold">
                        {{ store.netTradeImpact > 0 ? '-' : '+' }} {{ formatCurrency(Math.abs(store.netTradeImpact)) }}
                    </span>
                </div>
            </div>
        </div>
    </el-card>
</template>