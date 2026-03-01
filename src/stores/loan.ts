import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Vehicle } from '@/types'
import { BACKEND_API_URL } from '@/constants/utils'

export const useLoanStore = defineStore('loan', () => {
	// -- App State --
	const currentView = ref<'onboarding' | 'calculator' | 'application'>('calculator')
	const selectedVehicle = ref<Vehicle | null>(null)

	// NEW: Dynamic Loading Message
	const loadingMessage = ref('Loading Inventory...')

	// -- Calculator Inputs --
	const price = ref<number>(100000)
	const monthlyBudget = ref<number>(500)
	const filterMode = ref<'price' | 'budget'>('price')
	const sortOption = ref<string>('price-asc')

	const downPayment = ref<number>(1000)
	const tradeIn = ref<number>(0)
	const amountOwed = ref<number>(0)
	const interestRate = ref<number>(16.95)
	const loanTerm = ref<number>(72)

	// -- Advanced Filters State --
	const filters = ref({
		make: '',
		model: '',
		bodyType: '',
		yearRange: [2010, 2026] as [number, number],
		mileageRange: [0, 200000] as [number, number],
		fuelType: '',
		exteriorColor: '',
		inventoryType: '',
		transmission: '',
		drivetrain: '',
		trim: '',
		dealer: ''
	})

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

	// --- DEEP LINK LOGIC ---
	const processDeepLink = () => {
		const urlParams = new URLSearchParams(window.location.search)
		const vehicleId = urlParams.get('vehicle_id')

		if (vehicleId && inventory.value.length > 0) {
			const found = inventory.value.find((v) => v.id === vehicleId)
			if (found) {
				selectedVehicle.value = found
				console.log(`Deep linked to vehicle ID: ${vehicleId}`)
			}
		}
	}

	// -- Actions --
	const fetchInventory = async (force = false) => {
		if (!force && inventory.value.length > 0) return

		const urlParams = new URLSearchParams(window.location.search)
		if (urlParams.get('vehicle_id')) {
			loadingMessage.value = 'Locating your vehicle...'
		} else {
			loadingMessage.value = 'Loading Inventory...'
		}

		isFetchingVehicles.value = true
		fetchError.value = null

		try {
			const response = await fetch(`${BACKEND_API_URL}/api/vehicles`)

			if (!response.ok) {
				throw new Error(`API Error: ${response.statusText}`)
			}

			const data: Vehicle[] = await response.json()
			inventory.value = data
			console.log(`Loaded ${data.length} vehicles from backend.`)
		} catch (error) {
			console.error('Failed to load vehicle inventory:', error)
			fetchError.value = 'Unable to connect to the server. Please try again.'
			inventory.value = []
		} finally {
			setTimeout(() => {
				isFetchingVehicles.value = false
				processDeepLink()
			}, 500)
		}
	}

	const startApplication = () => {
		currentView.value = 'application'
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const skipOnboarding = () => {
		currentView.value = 'calculator'
	}

	const applyOnboarding = (budget: number | null, make: string, condition: string) => {
		resetCalculator()
		resetFilters()

		if (budget && budget > 0) {
			price.value = budget
			filterMode.value = 'price'
		}
		if (make) filters.value.make = make
		if (condition) filters.value.inventoryType = condition
		currentView.value = 'calculator'
	}

	const resetFilters = () => {
		filters.value = {
			make: '',
			model: '',
			bodyType: '',
			yearRange: [2010, 2026],
			mileageRange: [0, 200000],
			fuelType: '',
			exteriorColor: '',
			inventoryType: '',
			transmission: '',
			drivetrain: '',
			trim: '',
			dealer: ''
		}
	}

	const resetCalculator = () => {
		price.value = 25000
		monthlyBudget.value = 2000
		downPayment.value = 1000
		tradeIn.value = 0
		amountOwed.value = 0
		interestRate.value = 16.95
		loanTerm.value = 72
		filterMode.value = 'price'
		sortOption.value = 'price-asc'
		pageSize.value = 12
	}

	const resetView = () => {
		currentView.value = 'calculator'
		selectedVehicle.value = null
	}

	// -- Watchers --
	watch(
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
			pageSize,
			filters
		],
		() => {
			currentPage.value = 1

			if (price.value < 0) price.value = 0
			if (monthlyBudget.value < 0) monthlyBudget.value = 0
			if (downPayment.value < 0) downPayment.value = 0
			if (tradeIn.value < 0) tradeIn.value = 0
			if (amountOwed.value < 0) amountOwed.value = 0
			if (interestRate.value < 0) interestRate.value = 0
			interestRate.value = Math.round(interestRate.value * 100) / 100
		},
		{ deep: true }
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

	// --- FILTER LOGIC ---
	const filteredVehicles = computed(() => {
		let matches: Vehicle[] = []

		if (filterMode.value === 'budget') {
			matches = inventory.value.filter((v) => {
				const estimatedPayment = calculatePaymentForPrice(v.price)
				return estimatedPayment > 0 && estimatedPayment > monthlyBudget.value - 25
			})
		} else {
			const targetPrice = price.value
			matches = inventory.value.filter((v) => v.price <= targetPrice)
		}

		return matches.filter((v) => {
			if (filters.value.make && v.make !== filters.value.make) return false
			if (filters.value.model && v.model !== filters.value.model) return false
			if (filters.value.bodyType && v.body_type !== filters.value.bodyType) return false
			if (filters.value.fuelType && v.fuel_type !== filters.value.fuelType) return false
			if (filters.value.exteriorColor && v.exterior_color !== filters.value.exteriorColor) return false
			if (filters.value.inventoryType && v.inventory_type !== filters.value.inventoryType) return false
			if (filters.value.transmission && v.transmission !== filters.value.transmission) return false
			if (filters.value.drivetrain && v.drivetrain !== filters.value.drivetrain) return false
			if (filters.value.trim && v.trim !== filters.value.trim) return false
			if (filters.value.dealer && v.dealer.name !== filters.value.dealer) return false
			if (v.year < filters.value.yearRange[0] || v.year > filters.value.yearRange[1]) return false
			if (v.miles != null && (v.miles < filters.value.mileageRange[0] || v.miles > filters.value.mileageRange[1]))
				return false

			return true
		})
	})

	// --- Dynamic Options for Dropdowns ---
	const uniqueMakes = computed(() => [...new Set(inventory.value.map((v) => v.make))].sort())

	const uniqueModels = computed(() => {
		let list = inventory.value
		if (filters.value.make) {
			list = list.filter((v) => v.make === filters.value.make)
		}
		return [...new Set(list.map((v) => v.model))].sort()
	})

	const uniqueBodyTypes = computed(() => [...new Set(inventory.value.map((v) => v.body_type).filter(Boolean))].sort())
	const uniqueFuelTypes = computed(() => [...new Set(inventory.value.map((v) => v.fuel_type).filter(Boolean))].sort())
	const uniqueColors = computed(() =>
		[...new Set(inventory.value.map((v) => v.exterior_color).filter(Boolean))].sort()
	)
	const uniqueInventoryTypes = computed(() =>
		[...new Set(inventory.value.map((v) => v.inventory_type).filter(Boolean))].sort()
	)
	const uniqueTransmissions = computed(() =>
		[...new Set(inventory.value.map((v) => v.transmission).filter(Boolean))].sort()
	)
	const uniqueDrivetrains = computed(() =>
		[...new Set(inventory.value.map((v) => v.drivetrain).filter(Boolean))].sort()
	)
	const uniqueDealers = computed(() =>
		[...new Set(inventory.value.map((v) => v.dealer?.name).filter(Boolean))].sort()
	)

	const uniqueTrims = computed(() => {
		let list = inventory.value
		if (filters.value.model) {
			list = list.filter((v) => v.model === filters.value.model)
		}
		return [...new Set(list.map((v) => v.trim).filter(Boolean))].sort()
	})

	// --- Sorting ---
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
		// State
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
		loadingMessage, // NEW: Exported State
		fetchError,
		currentPage,
		pageSize,
		filters,

		// Computed
		netTradeImpact,
		principal,
		monthlyPayment,
		filteredVehicles,
		sortedVehicles,
		paginatedVehicles,
		totalVehicles,
		uniqueMakes,
		uniqueModels,
		uniqueBodyTypes,
		uniqueFuelTypes,
		uniqueColors,
		uniqueInventoryTypes,
		uniqueTransmissions,
		uniqueDrivetrains,
		uniqueTrims,
		uniqueDealers,

		// Actions
		startApplication,
		resetView,
		skipOnboarding,
		applyOnboarding,
		fetchInventory,
		calculatePaymentForPrice,
		resetFilters
	}
})
