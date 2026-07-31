/** @type {import('next').NextConfig} */
const nextConfig = {
  // คอมไพล์ TypeScript source จาก workspace packages โดยตรง
  transpilePackages: ["@peckey954/ui", "@peckey954/tokens"],
};

export default nextConfig;
