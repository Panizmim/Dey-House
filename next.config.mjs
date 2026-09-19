/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // بهینه‌ساز Vercel روشن است تا هر تصویر فقط یک‌بار از Supabase گرفته شود
    // و بعد از کش لبه سرو شود. بدون این کار، هر بازدیدکننده فایل را مستقیم
    // از Supabase می‌کشید و سهمیه ترافیک ماهانه را می‌سوزاند.
    //
    // تعداد سایزها و فرمت‌ها عمداً کم نگه داشته شده تا تعداد transformation
    // (که در پلن Hobby سقف دارد) پایین بماند.
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes:  [256, 384],
    formats:     ['image/webp'],
    // ۳۱ روز — تصاویر سایت به‌ندرت عوض می‌شوند
    minimumCacheTTL: 2678400,
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
