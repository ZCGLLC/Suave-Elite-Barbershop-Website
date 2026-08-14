import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const shopEmail = env.VITE_SHOP_BOOKING_EMAIL || env.SHOP_BOOKING_EMAIL || ''

  const barberEnv = (viteKey, plainKey) =>
    JSON.stringify(env[viteKey] || env[plainKey] || '')

  return {
    plugins: [react()],
    base: mode === 'production' ? '/Suave-Elite-Barbershop-Website/' : '/',
    preview: {
      host: true,
      allowedHosts: true,
    },
    server: {
      host: true,
      allowedHosts: true,
    },
    define: {
      'import.meta.env.VITE_SHOP_BOOKING_EMAIL': JSON.stringify(shopEmail),
      'import.meta.env.VITE_BARBER_EMAIL_MICHAEL_ANGELO': barberEnv(
        'VITE_BARBER_EMAIL_MICHAEL_ANGELO',
        'BARBER_EMAIL_MICHAEL_ANGELO',
      ),
      'import.meta.env.VITE_BARBER_EMAIL_BRYAN': barberEnv(
        'VITE_BARBER_EMAIL_BRYAN',
        'BARBER_EMAIL_BRYAN',
      ),
      'import.meta.env.VITE_BARBER_EMAIL_TRUEBLENDZ': barberEnv(
        'VITE_BARBER_EMAIL_TRUEBLENDZ',
        'BARBER_EMAIL_TRUEBLENDZ',
      ),
      'import.meta.env.VITE_BARBER_EMAIL_JC_CUTS': barberEnv(
        'VITE_BARBER_EMAIL_JC_CUTS',
        'BARBER_EMAIL_JC_CUTS',
      ),
      'import.meta.env.VITE_BARBER_EMAIL_AB_CUTZZ': barberEnv(
        'VITE_BARBER_EMAIL_AB_CUTZZ',
        'BARBER_EMAIL_AB_CUTZZ',
      ),
      'import.meta.env.VITE_BARBER_EMAIL_ANDY_ORU': barberEnv(
        'VITE_BARBER_EMAIL_ANDY_ORU',
        'BARBER_EMAIL_ANDY_ORU',
      ),
      'import.meta.env.VITE_BARBER_EMAIL_JACKIE_JAMES': barberEnv(
        'VITE_BARBER_EMAIL_JACKIE_JAMES',
        'BARBER_EMAIL_JACKIE_JAMES',
      ),
      'import.meta.env.VITE_BARBER_EMAIL_JHON_CUTS': barberEnv(
        'VITE_BARBER_EMAIL_JHON_CUTS',
        'BARBER_EMAIL_JHON_CUTS',
      ),
    },
  }
})
