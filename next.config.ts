/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "notion-avatars.netlify.app",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Prevents ESLint errors from breaking the production build
  },
};

module.exports = nextConfig;
