import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    plugins: [react(), eslint()],
    server: {
      watch: {
        usePolling: true
      },
      host: true,
      strictPort: true,
      port: 5173
    }
  })
}
