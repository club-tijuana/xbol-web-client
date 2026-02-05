import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.informabtl.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "www.tudn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "st1.uvnimg.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
