/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable static export if you're sure you don't need:
  // - API routes
  // - Middleware
  // - Dynamic server-side rendering
  // output: 'export', // Comment this out for now
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Image optimization configuration
  images: {
    // Only needed if you keep 'output: export'
    unoptimized: true,
    
    // Alternative remote patterns if using external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Disable caching in development if needed
    if (dev) {
      config.cache = false;
    }
    
    // Important: Fix for Prisma client in Next.js
    config.externals = [...(config.externals || []), '@prisma/client'];
    
    return config;
  },
  
  // Add this if you need to suppress ESLint warnings during builds
  typescript: {
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig;