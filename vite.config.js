import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    chunkSizeWarningLimit: 2000,
    // Vous pouvez ajouter une base ici si nécessaire :
    // base: '/your-repo-name/'
  },
  optimizeDeps: {
    include: ['cesium']
  }
});
