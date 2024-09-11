/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/terms',
        permanent: true
      }
    ]
  }
};

export default nextConfig;
