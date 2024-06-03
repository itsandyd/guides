/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "uploadthing.com",
      "lh3.googleusercontent.com",
      "static-cdn.jtvnw.net",
      "i.ytimg.com",
    ],
  },
  experimental: {
    appDir: true,
    serverActions: true,
    runtime: "nodejs",
  },
  serverRuntimeConfig: {
    maxDuration: 60, // Set the maximum duration to 5 seconds
  },
  dynamicParams: {
    forceDynamic: true, // Enable force-dynamic rendering
  },
};

module.exports = nextConfig;
