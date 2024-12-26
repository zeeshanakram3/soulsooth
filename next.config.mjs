/*
<ai_context>
Configures Next.js for the app.
</ai_context>
*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  // Add experimental configuration
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  },
  // Add output configuration
  output: 'standalone'
}

export default nextConfig
