/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },

  async redirects() {
    return [
      // Basic redirect
      {
        source: "/",
        destination: "/terms",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
