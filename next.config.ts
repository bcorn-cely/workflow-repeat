import { withWorkflow } from 'workflow/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
  ]
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path',
          destination: 'https://imax.com/:path'
        }
      ]
    }
  },
  // Enable Cache Components for Next.js 16
  cacheComponents: true,
  // Configure custom cache profiles
  cacheLife: {
    'cache-demo': {
      stale: 10, // 1 minute - client can use cached data
      revalidate: 10, // 1 minute - server regenerates in background
      expire: 10, // 5 minutes - cache expires after this time
    },
  },
}

const workflowConfig = {

}

export default withWorkflow(nextConfig, workflowConfig);
