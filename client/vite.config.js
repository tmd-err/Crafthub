import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    host: true,          // or use '0.0.0.0'
    port: 5173,          // default Vite port, can change if needed
    strictPort: true,    // fail if port is taken
  }
})
