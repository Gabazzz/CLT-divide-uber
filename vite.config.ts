import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Uber/99 Shared Rides',
        short_name: 'Uber Share',
        theme_color: '#0F1117',
        background_color: '#0F1117',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png', // Temporary generic icon for PWA
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
