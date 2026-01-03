import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')

	return {
		plugins: [
			vue(),
			vueDevTools(),
			{
				name: 'html-transform',
				transformIndexHtml(html) {
					if (mode === 'production' && env.VITE_GOOGLE_TAG_ID) {
						const gtmScript = `
							<!-- Google tag (gtag.js) -->
							<script async src="https://www.googletagmanager.com/gtag/js?id=${env.VITE_GOOGLE_TAG_ID}"></script>
							<script>
								window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());
								gtag('config', '${env.VITE_GOOGLE_TAG_ID}');
							</script>
							`
						return html.replace('</head>', `${gtmScript}</head>`)
					}

					return html
				}
			}
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url))
			}
		},
		server: {
			proxy: {
				'/api': {
					target: 'http://localhost:3000',
					changeOrigin: true,
					secure: false
				}
			}
		},
		build: {
			chunkSizeWarningLimit: 1000,
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes('node_modules')) {
							if (id.includes('element-plus')) {
								return 'element-plus'
							}
							return 'vendor'
						}
					}
				}
			}
		}
	}
})
