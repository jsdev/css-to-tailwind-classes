import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/css-to-tailwind-classes/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
