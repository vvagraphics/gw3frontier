import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Vercel to ignore ESLint errors during deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Tell Vercel to ignore strict TypeScript errors during deployment
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;