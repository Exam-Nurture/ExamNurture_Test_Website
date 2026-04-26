import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ExamNurture_Test_Website',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
