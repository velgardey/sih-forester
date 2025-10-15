import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["placehold.co"],
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/fra-map',
        permanent: true,
      },
      {
        source: '/dashboard/monitoring',
        destination: '/fra-map',
        permanent: true,
      },
      {
        source: '/dashboard/alerts',
        destination: '/fra-map',
        permanent: true,
      },
      {
        source: '/dashboard/analytics',
        destination: '/fra-map',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
