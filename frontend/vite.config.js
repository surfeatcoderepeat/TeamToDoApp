import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8000', // Usa la variable de entorno o un valor por defecto
        changeOrigin: true,
        secure: false,
      },
    },
  },
});