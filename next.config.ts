import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100MB",
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "thumbs.dreamstime.com",
        protocol: "https",
      },
      {
        hostname: "cloud.appwrite.io",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
