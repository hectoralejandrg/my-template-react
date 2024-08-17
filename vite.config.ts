import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

type KeysEnv = {
  [key: string]: string | undefined
}

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const env: KeysEnv = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  const newEnv = (env: KeysEnv) => {
    return Object.keys(env).reduce((prev, key) => {
      prev[`process.env.${key}`] = JSON.stringify(env[key])
      return prev
    }, {} as { [key: string]: string })
  }

  return defineConfig({
    plugins: [react(), eslint()],
    define: {
      ...newEnv(env)
    },
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
