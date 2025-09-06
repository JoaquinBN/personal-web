/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable experimental features for better Bun compatibility
    serverComponentsExternalPackages: [],
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Enable SWC minification for better performance
  swcMinify: true,
  // Configure image optimization
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  // Enable TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable ESLint during builds
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
