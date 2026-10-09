import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker imajı için sadece gereken dosyaları içeren bağımsız çıktı (deploy/Dockerfile)
  output: "standalone",
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
