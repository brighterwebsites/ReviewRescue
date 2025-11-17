/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['*.brighterwebsites.com.au', 'localhost:3000'],
    },
  },
}

module.exports = nextConfig
