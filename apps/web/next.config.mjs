/** @type {import('next').NextConfig} */
const nextConfig = {
  // คอมไพล์ TypeScript source จาก workspace packages โดยตรง
  transpilePackages: ["@repo/ui", "@repo/tokens"],
};

export default nextConfig;
