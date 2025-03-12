import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: '/',
    plugins: [react()],
    server: {
      port: env.VITE_UI_PORT,
      proxy: {
        '/api': {
          target: env.VITE_BASE_API_URL + '/api/v1',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
        '/ws': {
          target: env.VITE_BASE_API_URL,
          ws: true,
        },
      },
    },
  }

})