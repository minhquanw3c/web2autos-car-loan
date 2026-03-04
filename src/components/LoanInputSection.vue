<script setup lang="ts">
	import { useLoanStore } from '@/stores/loan'

	const store = useLoanStore()

	interface TermOption {
		value: number
		label: string
	}

	const termOptions: TermOption[] = [
		{ value: 12, label: '12 Months' },
		{ value: 24, label: '24 Months' },
		{ value: 36, label: '36 Months' },
		{ value: 48, label: '48 Months' },
		{ value: 60, label: '60 Months' },
		{ value: 72, label: '72 Months' }
	]
</script>

<template>
	<el-card shadow="hover" class="mb-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
		<template #header>
			<div class="flex flex-col sm:flex-row justify-between items-center gap-4">
				<div class="flex items-center text-lg font-bold text-gray-800 dark:text-white">
					<i class="fas fa-calculator text-blue-500 mr-2"></i>
					<span>Auto Loan Calculator</span>
				</div>
				<!-- Mode Toggle -->
				<el-radio-group v-model="store.filterMode" size="small">
					<el-radio-button label="price">By Price</el-radio-button>
					<el-radio-button label="budget">By Budget</el-radio-button>
				</el-radio-group>
			</div>
		</template>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<!-- Conditional Input: Price vs Budget -->
			<div class="space-y-1">
				<div class="flex items-center mb-1">
					<span class="text-sm font-semibold text-gray-600 dark:text-gray-300 mr-2">
						{{ store.filterMode === 'price' ? 'Vehicle Selling Price' : 'Target Monthly Budget' }}
					</span>
					<el-tooltip
						:content="
							store.filterMode === 'price'
								? 'The total sticker price of the vehicle.'
								: 'The maximum amount you want to pay per month.'
						"
						placement="top"
					>
						<i class="fas fa-info-circle text-gray-400 cursor-help"></i>
					</el-tooltip>
				</div>

				<!-- Price Input -->
				<el-input
					v-if="store.filterMode === 'price'"
					v-model.number="store.price"
					type="number"
					placeholder="0.00"
					size="large"
				>
					<template #prefix><i class="fas fa-dollar-sign text-gray-400"></i></template>
				</el-input>

				<!-- Budget Input -->
				<el-input
					v-else
					v-model.number="store.monthlyBudget"
					type="number"
					placeholder="0.00"
					size="large"
					class="!text-green-600"
				>
					<template #prefix><i class="fas fa-wallet text-green-500"></i></template>
				</el-input>
			</div>

			<!-- Down Payment -->
			<div class="space-y-1">
				<div class="flex items-center mb-1">
					<span class="text-sm font-semibold text-gray-600 dark:text-gray-300 mr-2">Cash Down Payment</span>
					<el-tooltip content="Cash paid upfront to reduce the loan amount." placement="top">
						<i class="fas fa-info-circle text-gray-400 cursor-help"></i>
					</el-tooltip>
				</div>
				<el-input v-model.number="store.downPayment" type="number" placeholder="0.00" size="large">
					<template #prefix><i class="fas fa-dollar-sign text-gray-400"></i></template>
				</el-input>
			</div>

			<!-- Interest Rate -->
			<div class="space-y-1 md:col-span-2 lg:col-span-1">
				<div class="flex justify-between items-center mb-1">
					<span class="text-sm font-semibold text-gray-600 dark:text-gray-300">Interest Rate (APR)</span>
					<span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded"
						>{{ store.interestRate }}%</span
					>
				</div>
				<el-slider
					v-model="store.interestRate"
					:min="0"
					:max="30.0"
					:step="0.01"
					size="small"
					show-input
					:show-input-controls="true"
				/>
			</div>

			<!-- Loan Duration -->
			<div class="space-y-1">
				<div class="flex items-center mb-1">
					<span class="text-sm font-semibold text-gray-600 dark:text-gray-300 mr-2">Loan Duration</span>
					<el-tooltip content="Length of the loan in months." placement="top">
						<i class="fas fa-info-circle text-gray-400 cursor-help"></i>
					</el-tooltip>
				</div>
				<el-select v-model="store.loanTerm" class="w-full" size="large" placeholder="Select Term">
					<el-option v-for="opt in termOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
				</el-select>
			</div>

			<!-- Trade-in Offer -->
			<div class="space-y-1">
				<div class="flex items-center mb-1">
					<span class="text-sm font-semibold text-gray-600 dark:text-gray-300 mr-2">Trade-in Offer</span>
					<el-tooltip content="The amount offered for your old car." placement="top">
						<i class="fas fa-info-circle text-gray-400 cursor-help"></i>
					</el-tooltip>
				</div>
				<el-input v-model.number="store.tradeIn" type="number" placeholder="0.00" size="large">
					<template #prefix><i class="fas fa-dollar-sign text-gray-400"></i></template>
				</el-input>
			</div>

			<!-- Amount Owed -->
			<div class="space-y-1">
				<div class="flex items-center mb-1">
					<span class="text-sm font-semibold text-gray-600 dark:text-gray-300 mr-2"
						>Amount Owed on Trade-in</span
					>
					<el-tooltip content="Remaining loan balance on your trade-in vehicle." placement="top">
						<i class="fas fa-info-circle text-gray-400 cursor-help"></i>
					</el-tooltip>
				</div>
				<el-input v-model.number="store.amountOwed" type="number" placeholder="0.00" size="large">
					<template #prefix><i class="fas fa-dollar-sign text-gray-400"></i></template>
				</el-input>
			</div>
		</div>
	</el-card>
</template>
