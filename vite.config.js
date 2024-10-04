import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cesium from 'vite-plugin-cesium';

export default defineConfig({
  plugins: [vue(), cesium()],
  build: {
    chunkSizeWarningLimit: 1600, // Pour éviter les avertissements sur les tailles
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium'), // Point de base pour les assets Cesium
  },
});
