import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3002,
    https: true
  },
  plugins: [vue(), viteBasicSslPlugin()]
})
