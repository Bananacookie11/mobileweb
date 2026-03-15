import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  base: '/mobileweb/lab05_Photo_React/',
  build: {
    outDir: path.resolve(__dirname, '../../docs/lab05_Photo_React'),
    emptyOutDir: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
});
