/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    runtime: 'nodejs',
    serverComponents: true,
    concurrentFeatures: true,
  },
};

module.exports = nextConfig;
