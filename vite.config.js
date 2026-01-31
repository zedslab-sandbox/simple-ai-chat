import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Note: When deploying behind a reverse proxy with a subpath (e.g., /apps/2/),
// set the base option to match the proxy path
export default defineConfig({
  plugins: [react()],
  // base: '/apps/2/'  // Uncomment and adjust for subpath deployments
})
