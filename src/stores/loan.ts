import { defineStore } from 'pinia'
import { ref, computed, watch, onMounted } from 'vue'
import type { Vehicle } from '@/types'
import { sampleVehicles } from '@/constants/vehicles'
import { BACKEND_API_URL } from '@/constants/utils'

export const useLoanStore = defineStore('loan', () => {
	// -- App State --
	const currentView = ref<'calculator' | 'application'>('calculator')
	const selectedVehicle = ref<Vehicle | null>(null)

	// -- Calculator State --
	const price = ref<number>(20000)
	const downPayment = ref<number>(1000)
	const tradeIn = ref<number>(0)
	const amountOwed = ref<number>(0)
	const interestRate = ref<number>(7.0)
	const loanTerm = ref<number>(24)

	// -- Inventory Data --
	const inventory = ref<Vehicle[]>([])
	const isFetchingVehicles = ref(false)
	const fetchError = ref<string | null>(null)

	// -- Pagination State --
	const currentPage = ref(1)
	const pageSize = ref(12)

	// -- Actions --
	const fetchInventory = async () => {
		if (inventory.value.length > 0) return

		isFetchingVehicles.value = true
		fetchError.value = null

		try {
			// For demo purpose
			inventory.value = sampleVehicles.map((vehicle) => {
				return {
					...vehicle,
					make: 'Test',
					model: 'Test',
					year: 2025,
				}
			})

			// const response = await fetch(`${BACKEND_API_URL}/api/vehicles`)
			// if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
			// const data: Vehicle[] = await response.json()
			// inventory.value = data
			// console.log(`Loaded ${data.length} vehicles from backend.`)
		} catch (error) {
			console.error('Failed to load vehicle inventory:', error)
			fetchError.value = 'Unable to load vehicles. Please check your connection.'
		} finally {
			isFetchingVehicles.value = false
		}
	}

	const startApplication = () => {
		currentView.value = 'application'
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const resetCalculator = () => {
		price.value = 20000
		downPayment.value = 1000
		tradeIn.value = 0
		amountOwed.value = 0
		interestRate.value = 7.0
		loanTerm.value = 24
	}

	const resetView = () => {
		currentView.value = 'calculator'
		selectedVehicle.value = null
		resetCalculator()
	}

	// -- Logic / Watchers --
	watch(
		[price, downPayment, tradeIn, amountOwed, interestRate],
		([newPrice, newDown, newTrade, newOwed, newRate]) => {
			// Reset page when filter criteria (price) changes
			currentPage.value = 1

			if (newPrice < 0) price.value = 0
			if (newDown < 0) downPayment.value = 0
			if (newTrade < 0) tradeIn.value = 0
			if (newOwed < 0) amountOwed.value = 0
			if (newRate < 0) interestRate.value = 0
		},
	)

	// -- Computed --
	const netTradeImpact = computed(() => (tradeIn.value || 0) - (amountOwed.value || 0))

	const principal = computed(() => {
		let p = (price.value || 0) - (downPayment.value || 0) - netTradeImpact.value
		return p > 0 ? p : 0
	})

	const monthlyPayment = computed(() => {
		const A = downPayment.value || 0
		const B = price.value || 0
		const C = tradeIn.value || 0
		const D = interestRate.value || 0
		const G = amountOwed.value || 0
		const H = loanTerm.value || 0

		const principalAmount = B - A - C + G
		if (principalAmount <= 0) return 0
		if (D === 0) return principalAmount / H

		const monthlyRate = D / 1200
		const numerator = principalAmount * monthlyRate
		const denominator = 1 - 1 / Math.pow(1 + monthlyRate, H)
		const payment = numerator / denominator

		return isFinite(payment) ? payment : 0
	})

	// 1. All matching vehicles (Filtered)
	const filteredVehicles = computed(() => {
		const targetPrice = price.value
		return inventory.value.filter((v) => v.price >= targetPrice)
	})

	// 2. Current Page Slice (Paginated)
	const paginatedVehicles = computed(() => {
		const start = (currentPage.value - 1) * pageSize.value
		const end = start + pageSize.value
		return filteredVehicles.value.slice(start, end)
	})

	// 3. Total count for UI
	const totalVehicles = computed(() => filteredVehicles.value.length)

	return {
		// State
		price,
		downPayment,
		tradeIn,
		amountOwed,
		interestRate,
		loanTerm,
		currentView,
		selectedVehicle,
		inventory,
		isFetchingVehicles,
		fetchError,
		currentPage,
		pageSize,

		// Computed
		netTradeImpact,
		principal,
		monthlyPayment,
		filteredVehicles,
		paginatedVehicles,
		totalVehicles,

		// Actions
		startApplication,
		resetView,
		fetchInventory,
	}
})
