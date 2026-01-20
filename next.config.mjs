/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones para producción
  poweredByHeader: false,
  
  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Logging en producción
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
}

export default nextConfig