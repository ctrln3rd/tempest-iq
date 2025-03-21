import type { NextConfig } from "next";

const isExportMode = process.env.EXPORT_MODE === 'true';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  output: isExportMode? 'export': undefined,
};

export default nextConfig;
