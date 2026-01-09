import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.worldofbooks.com',
      },
      {
        protocol: 'https',
        hostname: 'images.worldofbooks.com',
      }
    ],
  },
};

export default nextConfig;
