/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
    instrumentationHook: true,
  },
}

export default nextConfig
