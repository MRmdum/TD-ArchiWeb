/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'kappa.cours.quimerch.com',
          pathname: '/api/proxy',
        },
        {
          protocol: 'https',
          hostname: 'localhost',
          pathname: '/api/proxy',
        }
      ]
    },  
  };
  
  module.exports = nextConfig;