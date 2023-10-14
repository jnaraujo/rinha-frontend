import { defineConfig } from 'vite'
import webfontDownload from 'vite-plugin-webfont-dl';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), webfontDownload()],
})
