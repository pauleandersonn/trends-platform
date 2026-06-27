import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    // Next.js 16+: a config `turbopack` foi promovida para o root config
    // (não mais dentro de experimental). Mantemos experimental vazio até
    // validar a migração completa em uma próxima story.
  },
};

export default nextConfig;
