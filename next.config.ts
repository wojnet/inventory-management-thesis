import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  serverExternalPackages: ["@prisma/adapter-pg", "pg"],
};

export default nextConfig;
