// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 이 라이브러리가 설치되어 있어야 함

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 1204,
  },
});
