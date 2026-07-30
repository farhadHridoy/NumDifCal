import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/NumDifCal',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
