import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        host: '0.0.0.0', // exposes to your local network
        port: 5173,      // or any port you prefer
        strictPort: true // prevents fallback to another port
    }
})