import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), vueDevTools()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		// 1. Increase the warning limit to 1000kb (1MB) to handle large libraries like Element Plus
		chunkSizeWarningLimit: 1000,

		rollupOptions: {
			output: {
				// 2. Configure Manual Chunks
				// This forces Vite to split files instead of putting everything in one big file
				manualChunks(id) {
					if (id.includes('node_modules')) {
						// Split Element Plus into its own file
						if (id.includes('element-plus')) {
							return 'element-plus'
						}

						// Put other libraries (Vue, Pinia, etc.) in a 'vendor' file
						return 'vendor'
					}
				},
			},
		},
	},
})
