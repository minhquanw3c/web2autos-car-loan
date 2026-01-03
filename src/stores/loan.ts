import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Vehicle } from '@/types'
import { BACKEND_API_URL } from '@/constants/utils'

export const useLoanStore = defineStore('loan', () => {
	// -- App State --
	const currentView = ref<'calculator' | 'application'>('calculator')
	const selectedVehicle = ref<Vehicle | null>(null)

	// -- Calculator Inputs --
	const price = ref<number>(25000)
	const monthlyBudget = ref<number>(5000)
	const filterMode = ref<'price' | 'budget'>('price')
	const sortOption = ref<string>('price-desc')

	const downPayment = ref<number>(1000)
	const tradeIn = ref<number>(0)
	const amountOwed = ref<number>(0)
	const interestRate = ref<number>(7.0)
	const loanTerm = ref<number>(60)

	// -- Inventory Data --
	const inventory = ref<Vehicle[]>([])
	const isFetchingVehicles = ref(false)
	const fetchError = ref<string | null>(null)

	// -- Pagination --
	const currentPage = ref(1)
	const pageSize = ref(12)

	// --- HELPER: Dynamic Calculation ---
	const calculatePaymentForPrice = (targetVehiclePrice: number) => {
		const A = downPayment.value || 0
		const C = tradeIn.value || 0
		const G = amountOwed.value || 0
		const D = interestRate.value || 0
		const H = loanTerm.value || 0

		const netTrade = C - G
		const principalAmount = targetVehiclePrice - A - netTrade

		if (principalAmount <= 0) return 0
		if (D === 0 && H > 0) return principalAmount / H

		const monthlyRate = D / 1200
		const numerator = principalAmount * monthlyRate
		const denominator = 1 - 1 / Math.pow(1 + monthlyRate, H)

		const payment = numerator / denominator
		return isFinite(payment) ? payment : 0
	}

	// -- Actions --
	const fetchInventory = async () => {
		if (inventory.value.length > 0) return

		isFetchingVehicles.value = true
		fetchError.value = null

		try {
			// Use your backend URL constant
			const response = await fetch(`${BACKEND_API_URL}/api/vehicles`)

			if (!response.ok) {
				throw new Error(`API Error: ${response.statusText}`)
			}

			const data: Vehicle[] = await response.json()
			inventory.value = data
			console.log(`Loaded ${data.length} vehicles from backend.`)
		} catch (error) {
			console.error('Failed to load vehicle inventory:', error)
			fetchError.value = 'Unable to load vehicles. Using sample data.'
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
		monthlyBudget.value = 450
		downPayment.value = 1000
		tradeIn.value = 0
		amountOwed.value = 0
		interestRate.value = 7.0
		loanTerm.value = 24
		filterMode.value = 'price'
		sortOption.value = 'price-asc'
		pageSize.value = 12
	}

	const resetView = () => {
		currentView.value = 'calculator'
		selectedVehicle.value = null
		resetCalculator()
	}

	// -- Watchers --
	watch(
		// Added sortOption and pageSize to watcher so pagination resets correctly
		[
			price,
			monthlyBudget,
			downPayment,
			tradeIn,
			amountOwed,
			interestRate,
			loanTerm,
			filterMode,
			sortOption,
			pageSize
		],
		() => {
			currentPage.value = 1

			if (price.value < 0) price.value = 0
			if (monthlyBudget.value < 0) monthlyBudget.value = 0
			if (downPayment.value < 0) downPayment.value = 0
			if (tradeIn.value < 0) tradeIn.value = 0
			if (amountOwed.value < 0) amountOwed.value = 0
			if (interestRate.value < 0) interestRate.value = 0
		}
	)

	// -- Computed --
	const netTradeImpact = computed(() => (tradeIn.value || 0) - (amountOwed.value || 0))

	const principal = computed(() => {
		let p = (price.value || 0) - (downPayment.value || 0) - netTradeImpact.value
		return p > 0 ? p : 0
	})

	const monthlyPayment = computed(() => {
		return calculatePaymentForPrice(price.value)
	})

	const filteredVehicles = computed(() => {
		if (filterMode.value === 'budget') {
			return inventory.value.filter((v) => {
				const estimatedPayment = calculatePaymentForPrice(v.price)
				return estimatedPayment > 0 && estimatedPayment <= monthlyBudget.value + 10
			})
		} else {
			const targetPrice = price.value
			return inventory.value.filter((v) => v.price <= targetPrice)
		}
	})

	const sortedVehicles = computed(() => {
		const vehicles = [...filteredVehicles.value]

		switch (sortOption.value) {
			case 'price-asc':
				return vehicles.sort((a, b) => a.price - b.price)
			case 'price-desc':
				return vehicles.sort((a, b) => b.price - a.price)
			case 'year-desc':
				return vehicles.sort((a, b) => b.year - a.year)
			case 'year-asc':
				return vehicles.sort((a, b) => a.year - b.year)
			default:
				return vehicles
		}
	})

	const paginatedVehicles = computed(() => {
		const start = (currentPage.value - 1) * pageSize.value
		const end = start + pageSize.value
		return sortedVehicles.value.slice(start, end)
	})

	const totalVehicles = computed(() => filteredVehicles.value.length)

	return {
		price,
		monthlyBudget,
		filterMode,
		sortOption,
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

		netTradeImpact,
		principal,
		monthlyPayment,
		filteredVehicles,
		sortedVehicles,
		paginatedVehicles,
		totalVehicles,

		startApplication,
		resetView,
		fetchInventory,
		calculatePaymentForPrice
	}
})
