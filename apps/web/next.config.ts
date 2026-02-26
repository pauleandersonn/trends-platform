import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    turbopack: {
      root: __dirname,
    },
  },
};

export default nextConfig;
