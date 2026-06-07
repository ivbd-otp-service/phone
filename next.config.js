/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Rewrite so that /phone-017... hits /api/phone/017...
  async rewrites() {
    return [
      {
        source: '/phone-:phone',
        destination: '/api/phone/:phone',
      },
    ];
  },
};

module.exports = nextConfig;