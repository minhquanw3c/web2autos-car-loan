export interface Vehicle {
	id: string
	make: string
	model: string
	year: number
	price: number
	mediaUrl: string
	source: string
	miles: number
	inventory_type: string
	stock_no: string
	heading: string
	referenceUrl: string
	dealer: {
		name: string
		street: string
	}
}

export interface FormComponentConfig {
	type: string
	options?: string | string[]
}

export interface FormInput {
	label: string
	type: string
	required?: boolean
	default?: any
	options?: string[] | string
	format?: string
	masked?: boolean
	components?: Record<string, FormComponentConfig>
}

export interface FormGroup {
	heading: string
	inputs: FormInput[]
}

export interface FormSchema {
	formHeading: string
	formDescription: string
	groups: FormGroup[]
}
