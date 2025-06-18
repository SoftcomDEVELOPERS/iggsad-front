// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      port: Number(env.VITE_DEV_PORT) || 5173,
      proxy: {
        '/api': {
          target: env.VITE_SSO_URL || 'https://localhost:5116',
          changeOrigin: true,
          secure: false, // Para certificados self-signed en desarrollo
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Enviar cookies en las peticiones proxy
              if (req.headers.cookie) {
                proxyReq.setHeader('cookie', req.headers.cookie)
              }
            })
          }
        }
      }
    }
  }
})