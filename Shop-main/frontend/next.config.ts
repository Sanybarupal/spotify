import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/golf-api/:path*",
        destination: "http://127.0.0.1/golf-api/:path*",
      },
    ];
  },
};

export default nextConfig;
