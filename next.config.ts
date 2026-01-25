import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dtastdphfgvximdkbxdm.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
    // serverComponentsExternalPackages: ['pdfjs-dist', 'canvas'], // Deprecated in some versions, but let's keep it safe or move to top level
  },
  serverExternalPackages: ['pdfjs-dist', 'canvas'], // Newer Next.js syntax
  transpilePackages: ['react-pdf', 'pdfjs-dist'],
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    // Fix for pdfjs-dist
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default nextConfig;
