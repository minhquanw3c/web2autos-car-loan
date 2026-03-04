<script setup lang="ts">
	import { useLoanStore } from '@/stores/loan'

	const store = useLoanStore()
</script>

<template>
	<div class="mx-auto py-12 px-4 animate-[fadeIn_0.5s_ease-out] text-slate-800 dark:text-white">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-5xl font-bold mb-6 drop-shadow-md">Terms of Service</h2>
			<p class="text-slate-600 dark:text-blue-200 text-lg">Last updated: June 12, 2025</p>
		</div>

		<div
			class="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-xl space-y-8"
		>
			<section>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					Welcome to Web2Autos.com (“Site”). Please read these Terms of Use (“Terms”) carefully before using
					the Site. By accessing or submitting information through this Site, you agree to comply with and be
					bound by the following Terms and Conditions.
				</p>
			</section>

			<section>
				<h3 class="text-2xl font-bold mb-4 text-indigo-400">1. Services Provided</h3>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					Web2Autos is a marketing and lead generation platform that connects consumers with participating
					auto dealerships and finance providers. We are not a lender, auto broker, or dealership and do not
					sell vehicles or make credit decisions. All loan or financing offers are made solely by licensed
					third-party providers.
				</p>
			</section>

			<section>
				<h3 class="text-2xl font-bold mb-4 text-indigo-400">2. No Guarantee of Financing or Approval</h3>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					Submitting an application does not guarantee credit approval, pre-qualification, specific financing
					terms, or vehicle availability. All decisions regarding financing, down payment, and vehicle
					selection are made exclusively by the third-party dealer or lender to whom your information is
					submitted.
				</p>
			</section>

			<section>
				<h3 class="text-2xl font-bold mb-4 text-indigo-400">3. Consumer Responsibilities</h3>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">By using this Site, you agree to:</p>
				<ul
					class="list-disc list-inside text-slate-600 dark:text-slate-300 leading-relaxed mt-4 space-y-2 pl-4"
				>
					<li>Provide accurate, complete, and truthful information</li>
					<li>Only submit your own information (not on behalf of others without consent)</li>
					<li>Refrain from using the Site for any unlawful, fraudulent, or abusive purposes</li>
					<li>Not interfere with or disrupt the integrity or performance of the Site or its services</li>
				</ul>
			</section>

			<section>
				<h3 class="text-2xl font-bold mb-4 text-indigo-400">4. Use of Personal Information</h3>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					Your information may be shared with one or more third-party dealerships or financing providers for
					the purpose of matching you with a potential financing opportunity. All data usage is governed by
					our Privacy Policy (#), which forms an integral part of these Terms.
				</p>
			</section>

			<section>
				<h3 class="text-2xl font-bold mb-4 text-indigo-400">5. No Agency Relationship</h3>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					Your use of the Site does not create any agency, partnership, or joint venture between you and
					Web2Autos. We act solely as a platform to connect consumers and dealers and are not responsible for
					the outcome of any transaction or financing decision.
				</p>
			</section>

			<section>
				<h3 class="text-2xl font-bold mb-4 text-indigo-400">6. Limitation of Liability</h3>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">Web2Autos is not liable for:</p>
				<ul
					class="list-disc list-inside text-slate-600 dark:text-slate-300 leading-relaxed mt-4 space-y-2 pl-4 mb-4"
				>
					<li>Any financing decisions made by third parties</li>
					<li>Delays, system errors, or interruptions in site access</li>
					<li>Any direct, indirect, incidental, or consequential damages arising from use of this Site</li>
				</ul>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">You use the Site at your own risk.</p>
			</section>

			<section>
				<h3 class="text-2xl font-bold mb-4 text-indigo-400">7. Governing Law</h3>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					These Terms shall be governed by and interpreted in accordance with the laws of the State of
					California, without regard to its conflict of law rules.
				</p>
			</section>

			<section>
				<h3 class="text-2xl font-bold mb-4 text-indigo-400">8. Dispute Resolution (Binding Arbitration)</h3>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					Any disputes arising out of or related to your use of the Site shall be resolved through binding
					arbitration in California, under the rules of the American Arbitration Association. By using the
					Site, you waive your right to a jury trial or to participate in a class action lawsuit.
				</p>
			</section>

			<section>
				<h3 class="text-2xl font-bold mb-4 text-indigo-400">9. Indemnification</h3>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					You agree to indemnify, defend, and hold harmless Web2Autos, its affiliates, partners, and employees
					from any liability, damages, losses, or expenses (including legal fees) arising out of your misuse
					of the Site or violation of these Terms.
				</p>
			</section>

			<section>
				<h3 class="text-2xl font-bold mb-4 text-indigo-400">10. Termination</h3>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					Web2Autos may suspend or terminate your access to the Site at any time without notice if we believe
					you have violated these Terms or misused our services.
				</p>
			</section>

			<section>
				<h3 class="text-2xl font-bold mb-4 text-indigo-400">11. Modifications to Terms</h3>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
					We reserve the right to modify these Terms at any time. Any updates will be posted on this page with
					the new effective date. Your continued use of the Site constitutes acceptance of the updated Terms.
				</p>
			</section>

			<section>
				<h3 class="text-2xl font-bold mb-4 text-indigo-400">12. Contact Information</h3>
				<p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
					If you have questions or concerns about these Terms, please contact:
				</p>
				<ul
					class="list-disc list-inside text-slate-600 dark:text-slate-300 leading-relaxed mt-4 space-y-2 pl-4 mb-4"
				>
					<li>Email: info@web2autos.com</li>
					<li>
						Mailing Address:<br />
						Web2Autos.com LLC <br />
						38623 FREMONT BLVD STE 185<br />
						FREMONT, CA 94536
					</li>
				</ul>
			</section>
		</div>

		<div class="text-center mt-12">
			<button
				@click="store.resetView"
				class="inline-flex items-center gap-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white px-8 py-4 rounded-full font-bold transition-all border border-slate-300 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40 active:scale-95"
			>
				<i class="fas fa-arrow-left"></i> Back to Home
			</button>
		</div>
	</div>
</template>
