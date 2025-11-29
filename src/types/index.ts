export interface Vehicle {
	id: number
	make: string
	model: string
	year: number
	price: number
	img: string
	desc: string
}

export interface FormComponentConfig {
	type: string
	options?: string | string[]
}

export interface FormInput {
	label: string
	type: string // 'text', 'email', 'number', 'password', 'select', 'checkbox'
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
