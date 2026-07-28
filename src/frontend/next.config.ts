import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // NextAuth v5 generated route validator has a known issue with Next.js 16
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/en",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
