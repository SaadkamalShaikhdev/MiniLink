/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile photos
      },
    ],
  },
};

export default nextConfig;
