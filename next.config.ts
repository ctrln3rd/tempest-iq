import type { NextConfig } from "next";

const isExportMode = process.env.EXPORT_MODE || 'ssr';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  output: isExportMode === 'static' ? 'export': undefined,
};

export default nextConfig;
