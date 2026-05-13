import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: change this to '/your-repo-name/' when deploying to GitHub Pages
  base: '/kashta-tracker/',
});
