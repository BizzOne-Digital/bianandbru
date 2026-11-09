import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Same-origin MongoDB-backed uploads + local static images
    localPatterns: [{ pathname: "/api/uploads/**" }, { pathname: "/images/**" }],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
