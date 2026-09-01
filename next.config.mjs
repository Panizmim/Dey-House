/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // تصاویر پیش از آپلود به WebP تبدیل می‌شوند؛ بنابراین بهینه‌ساز runtime
    // و محدودیت Image Optimization در Vercel لازم نیست.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'heic-convert'],
    instrumentationHook: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'deyhouse.com' }],
        destination: 'https://www.deyhouse.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
