import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    historyApiFallback: true
  }
})
