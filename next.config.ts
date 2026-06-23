import type { NextConfig } from 'next';

import { publicEnv } from './src/config/env';

const adminImageHost = publicEnv.NEXT_PUBLIC_ADMIN_IMAGE_HOST;

const nextConfig: NextConfig = {
  basePath: publicEnv.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: publicEnv.NEXT_PUBLIC_ASSET_PREFIX || '',
  skipProxyUrlNormalize: true,
  skipTrailingSlashRedirect: true,
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
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      ...(adminImageHost
        ? [{
          protocol: 'https' as const,
          hostname: adminImageHost,
          pathname: '/admin/images/**',
        }]
        : []),
    ],
  },
};

export default nextConfig;
