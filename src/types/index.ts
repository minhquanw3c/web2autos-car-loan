export interface Vehicle {
	id: string
	heading: string
	price: number
	miles: number
	inventory_type: string
	stock_no: string
	source: string
	dealer: {
		name: string
		street: string
		dealer_type: string
	}
	year: number
	make: string
	model: string
	trim: string
	version: string
	body_type: string
	vehicle_type: string
	transmission: string
	drivetrain: string
	fuel_type: string
	engine: string
	engine_size: string
	engine_block: string
	doors: number
	cylinders: number
	overall_height: string
	overall_width: string
	std_seating: string
	highway_mpg: number
	city_mpg: number
	powertrain_type: string
	price_change_percent: number
	msrp: number
	exterior_color: string
	interior_color: string
	base_int_color: string
	base_ext_color: string
	dom: number
	mediaUrls: string[]
	referenceUrl: string
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
