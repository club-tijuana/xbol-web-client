import type { NextConfig } from 'next';

import { validatePublicEnv } from './src/config/env';

validatePublicEnv(process.env);

const adminImageHost = process.env.NEXT_PUBLIC_ADMIN_IMAGE_HOST;

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
