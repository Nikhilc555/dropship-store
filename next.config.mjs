/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cc-west-usa.oss-us-west-1.aliyuncs.com' },
      { protocol: 'https', hostname: 'cf.cjdropshipping.com' }
    ],
  },
};

export default nextConfig;

