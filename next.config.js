/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['three', 'gsap', '@react-three/fiber', '@react-three/drei'],
  images: { formats: ['image/avif', 'image/webp'] },
};

module.exports = nextConfig;
