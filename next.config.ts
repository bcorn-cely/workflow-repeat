import { withWorkflow } from 'workflow/next';

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/included-health',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/included-health',
        destination: '/',
      }
    ]
  }
}

const workflowConfig = {

}

export default withWorkflow(nextConfig, workflowConfig);
