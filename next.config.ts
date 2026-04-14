import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  skipMiddlewareUrlNormalize: true,
  trailingSlash: true,
  output: 'standalone',
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
