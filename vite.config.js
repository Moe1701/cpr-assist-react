import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Das ist der Motor, der Tailwind in den Server einbaut
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})