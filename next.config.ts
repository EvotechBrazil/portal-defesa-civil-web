import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empacota em .next/standalone: o container roda `node server.js` sem
  // precisar do node_modules inteiro. Exigido pelo Dockerfile.
  output: "standalone",
};

export default nextConfig;
