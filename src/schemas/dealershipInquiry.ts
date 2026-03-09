import { z } from 'zod'

export const DealershipInquirySchema = z
	.object({
		// --- First Section ---
		dealership_name: z.string().min(1, 'Dealership name is required').max(100, 'Max length is 100'),
		is_franchise: z.enum(['Yes', 'No'], {
			errorMap: () => ({ message: 'Please select if you are a franchise dealership' })
		}),
		gm_firstname: z.string().min(1, 'General Manager first name is required').max(50, 'Max length is 50'),
		gm_lastname: z.string().min(1, 'General Manager last name is required').max(50, 'Max length is 50'),

		// --- Second Section: Address ---
		address_line1: z.string().min(1, 'Address Line 1 is required').max(100, 'Max length is 100'),
		address_line2: z.string().max(100, 'Max length is 100').optional().or(z.literal('')),
		city: z.string().min(1, 'City is required').max(50, 'Max length is 50'),
		state: z.string().min(2, 'State is required').max(50, 'Max length is 50'),
		zip_code: z.string().min(5, 'Zip code is required').max(50, 'Max length is 50'),

		// --- Third Section: Contact ---
		phone: z.string().min(1, 'Phone number is required').max(50, 'Max length is 50'),
		email: z.string().email('Invalid email address').max(50, 'Max length is 50'),
		best_time_to_contact: z.enum(['Morning', 'Afternoon', 'Evening'], {
			errorMap: () => ({ message: 'Select Morning, Afternoon, or Evening' })
		}),
		sub_prime_department: z.enum(['Yes', 'No', 'Not sure'], {
			errorMap: () => ({ message: 'Select Yes, No, or Not sure' })
		}),
		website: z.string().min(1, 'Website is required').max(100, 'Max length is 100'),
		note: z.string().max(500, 'Max length is 500').optional().or(z.literal(''))
	})
	.passthrough()
