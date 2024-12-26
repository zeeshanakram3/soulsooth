/*
<ai_context>
Configures Next.js for the app.
</ai_context>
*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['*'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ]
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
