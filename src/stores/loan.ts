import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Vehicle } from '@/types'

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

	// -- Mock Vehicle Data --
	const inventory: Vehicle[] = [
		{
			id: 1,
			make: 'Toyota',
			model: 'Camry SE',
			year: 2021,
			price: 24500,
			img: 'https://placehold.co/600x400/1e293b/FFF?text=Toyota+Camry',
			desc: 'Reliable sedan with sport tuning and advanced safety features.',
		},
		{
			id: 2,
			make: 'Honda',
			model: 'Civic EX',
			year: 2022,
			price: 22000,
			img: 'https://placehold.co/600x400/1e293b/FFF?text=Honda+Civic',
			desc: 'Fuel efficient compact car with a spacious interior.',
		},
		{
			id: 3,
			make: 'Ford',
			model: 'F-150 XL',
			year: 2020,
			price: 32000,
			img: 'https://placehold.co/600x400/1e293b/FFF?text=Ford+F-150',
			desc: 'Powerful work truck with towing capability.',
		},
		{
			id: 4,
			make: 'Chevrolet',
			model: 'Malibu',
			year: 2021,
			price: 19500,
			img: 'https://placehold.co/600x400/1e293b/FFF?text=Chevy+Malibu',
			desc: 'Comfortable midsize sedan perfect for commuting.',
		},
		{
			id: 5,
			make: 'Nissan',
			model: 'Altima',
			year: 2022,
			price: 23000,
			img: 'https://placehold.co/600x400/1e293b/FFF?text=Nissan+Altima',
			desc: 'Tech-forward sedan with AWD options.',
		},
		{
			id: 6,
			make: 'Hyundai',
			model: 'Elantra',
			year: 2023,
			price: 21500,
			img: 'https://placehold.co/600x400/1e293b/FFF?text=Hyundai+Elantra',
			desc: 'Stylish design with excellent warranty coverage.',
		},
		{
			id: 7,
			make: 'BMW',
			model: '330i',
			year: 2019,
			price: 31000,
			img: 'https://placehold.co/600x400/1e293b/FFF?text=BMW+3+Series',
			desc: 'Luxury sports sedan with premium interior.',
		},
		{
			id: 8,
			make: 'Kia',
			model: 'K5',
			year: 2022,
			price: 25000,
			img: 'https://placehold.co/600x400/1e293b/FFF?text=Kia+K5',
			desc: 'Bold styling and turbo performance.',
		},
	]

	// -- Logic --
	watch(
		[price, downPayment, tradeIn, amountOwed, interestRate],
		([newPrice, newDown, newTrade, newOwed, newRate]) => {
			if (newPrice < 0) price.value = 0
			if (newDown < 0) downPayment.value = 0
			if (newTrade < 0) tradeIn.value = 0
			if (newOwed < 0) amountOwed.value = 0
			if (newRate < 0) interestRate.value = 0
		},
	)

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

	const recommendedVehicles = computed(() => {
		const targetPrice = price.value
		return inventory.filter(
			(v) => v.price >= targetPrice - 10000 && v.price <= targetPrice + 10000,
		)
	})

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

	return {
		price,
		downPayment,
		tradeIn,
		amountOwed,
		interestRate,
		loanTerm,
		currentView,
		selectedVehicle,
		netTradeImpact,
		principal,
		monthlyPayment,
		recommendedVehicles,
		inventory,
		startApplication,
		resetView,
	}
})
