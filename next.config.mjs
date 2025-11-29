/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,  // this should be true in longterm development
  images: {
    domains: ['storage.googleapis.com', 'mdbcdn.b-cdn.net'],
  }
};



export default nextConfig;
