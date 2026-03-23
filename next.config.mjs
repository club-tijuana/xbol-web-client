/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.informabtl.com",
        pathname: "/**",
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
      {
        protocol: "https",
        hostname: "dev.zorbek.software",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
