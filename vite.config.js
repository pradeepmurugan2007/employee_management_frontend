import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({

  plugins: [react()],

  server: {

    allowedHosts: [
      "spectrochemical-tyra-souplike.ngrok-free.dev"
    ]
  }
})