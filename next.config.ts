import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/airline-club/:path*',
        destination: 'https://v2.airline-club.com/:path*',
      },
    ];
  },
};

export default nextConfig;
