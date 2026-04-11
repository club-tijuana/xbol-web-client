import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/XBOL',
  output: 'standalone',
  productionBrowserSourceMaps: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.informabtl.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tudn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'st1.uvnimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dev.zorbek.software',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
