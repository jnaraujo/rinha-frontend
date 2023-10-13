import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import webfontDownload from 'vite-plugin-webfont-dl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), webfontDownload()],
})
