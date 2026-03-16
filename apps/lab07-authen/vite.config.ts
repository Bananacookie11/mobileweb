import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), legacy()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  base: '/mobileweb/lab07_authen/',
  build: {
    outDir: path.resolve(__dirname, '../../docs/lab07_authen'),
    emptyOutDir: true
  }
})