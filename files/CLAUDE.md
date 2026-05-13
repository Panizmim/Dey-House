# CLAUDE.md — خانه دی

## درباره پروژه
وبسایت رسمی خانه دی — کافه‌گالری و فضای فرهنگی معاصر
دامنه: deyhouse.ir
ادمین پنل: deyhouse.ir/admin

---

## Stack فنی

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + tailwindcss-rtl plugin
- **Font**: Yekan Bakh (فایل‌های TTF لوکال در /public/fonts)
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Date Picker**: react-day-picker با locale فارسی (date-fns/locale/fa-IR)
- **HTTP**: TanStack Query (React Query)
- **Animations**: Framer Motion

### Backend
- **Runtime**: Next.js API Routes (همان پروژه)
- **ORM**: Prisma
- **Database**: PostgreSQL (Supabase)
- **Auth**: NextAuth.js v5
- **File Upload**: Uploadthing یا Cloudflare R2
- **Email**: Resend
- **SMS**: Kavenegar
- **Payment**: ZarinPal (sandbox در dev)
- **Cache**: Redis (Upstash)

### Infrastructure
- **Deploy**: Vercel (frontend) + Railway (اگر نیاز به سرور جداگانه)
- **CDN**: Cloudflare
- **Storage**: Cloudflare R2

---

## قوانین کدنویسی

### عمومی
- همه کامنت‌ها، متن‌های UI، و پیام‌های خطا به **فارسی**
- همه فایل‌ها TypeScript — هیچ `any` استفاده نکن
- همیشه `dir="rtl"` و `lang="fa"` روی html element
- از `next/image` برای همه تصاویر استفاده کن
- از `next/link` برای همه لینک‌های داخلی

### ساختار فایل‌ها
```
/app                    ← App Router
  /(site)               ← صفحات عمومی سایت
    /page.tsx           ← صفحه اصلی
    /events/page.tsx
    /events/[slug]/page.tsx
    /cafe/page.tsx
    /gallery/page.tsx
    /booking/page.tsx
    /artist/page.tsx
    /about/page.tsx
    /contact/page.tsx
  /(auth)               ← صفحات احراز هویت
    /login/page.tsx
    /register/page.tsx
  /(dashboard)          ← داشبورد کاربر (protected)
    /dashboard/page.tsx
    /dashboard/bookings/page.tsx
    /dashboard/profile/page.tsx
  /admin                ← پنل ادمین (role: ADMIN)
    /page.tsx
    /bookings/page.tsx
    /events/page.tsx
    /...
  /api                  ← API Routes
    /auth/[...nextauth]/route.ts
    /booking/route.ts
    /events/route.ts
    /...

/components
  /ui                   ← کامپوننت‌های پایه (Button, Input, Card, ...)
  /sections             ← سکشن‌های صفحات (Hero, EventsGrid, ...)
  /layouts              ← Layout کامپوننت‌ها
  /forms                ← فرم‌های پیچیده

/lib
  /db.ts                ← Prisma client
  /auth.ts              ← NextAuth config
  /utils.ts             ← helper functions
  /validations.ts       ← Zod schemas

/prisma
  /schema.prisma

/public
  /fonts                ← فایل‌های TTF یکان بخ
```

### Naming Conventions
- کامپوننت‌ها: PascalCase (`EventCard.tsx`)
- توابع و متغیرها: camelCase (`getBookingSlots`)
- فایل‌های route: kebab-case (`booking-confirmation.ts`)
- متغیرهای env: SCREAMING_SNAKE_CASE

---

## برند و دیزاین سیستم

### رنگ‌های اصلی
```css
--brand-red: #8C2020;
--brand-red-light: #A82828;
--brand-red-bg: #F9F0F0;
```
> ⚠️ رنگ‌های دقیق برند از فایل design-tokens.css در /styles بخوان

### فونت
```css
font-family: 'YekanBakh', Tahoma, sans-serif;
/* وزن‌ها: 300 (Light), 400 (Regular), 700 (Bold), 900 (Heavy) */
```

### اصول کلی دیزاین
- بک‌گراند سفید (#FFFFFF)
- کارت‌ها با border خاکستری روشن
- رویدادها به صورت **کارت محصول** با تصویر، badge تاریخ، و badge نوع
- RTL کامل، همه چیز فارسی
- Hover state روی همه interactive element‌ها

---

## Database Schema (Prisma)

مدل‌های اصلی:
- **User** — کاربران (role: USER | ADMIN)
- **Studio** — پلاتوها (نام، ظرفیت، قیمت/ساعت)
- **Booking** — رزروها (userId, studioId, date, startTime, endTime, type, status, paymentStatus)
- **ContactRequest** — درخواست رزرو غیرتئاتر (name, phone, email, usageType, message)
- **ArtistSubmission** — فرم همکاری هنرمندان
- **Event** — رویدادها (title, slug, date, time, type, imageUrl, isArchived)
- **CafeMenuItem** — منوی کافه (name, price, category, isAvailable)
- **GalleryImage** — تصاویر گالری

---

## Business Logic مهم

### سیستم رزرو — دو Flow متفاوت

**Flow 1: تمرین تئاتر**
1. انتخاب پلاتو
2. انتخاب تاریخ (تقویم شمسی)
3. انتخاب slot آزاد (از API)
4. ثبت‌نام / لاگین
5. پرداخت ZarinPal
6. دریافت confirmation (SMS + Email)

**Flow 2: سایر کاربری‌ها** (ورکشاپ، فیلمبرداری، یوگا، عکاسی)
1. انتخاب نوع کاربری
2. نمایش فرم اطلاعات تماس
3. ذخیره در ContactRequest
4. پیام: «تیم خانه دی با شما تماس می‌گیرد»
5. رزرو مستقیم آنلاین **نمی‌شود**

### Authorization
- صفحات `/dashboard/*` → باید لاگین باشد
- صفحات `/admin/*` → باید `role === ADMIN` باشد
- API routes → middleware بررسی session

---

## Environment Variables

```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Payment
ZARINPAL_MERCHANT_ID=

# Upload
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Email
RESEND_API_KEY=

# SMS
KAVENEGAR_API_KEY=

# Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## دستورات مهم

```bash
npm run dev          # سرور توسعه
npm run build        # build برای production
npx prisma studio    # GUI دیتابیس
npx prisma db push   # sync schema با db
npx prisma generate  # regenerate client
npx prisma migrate dev --name [name]  # migration جدید
```

---

## نکات مهم برای Claude Code

1. قبل از هر تغییر در schema، migration بساز نه فقط `db push`
2. همیشه `loading.tsx` و `error.tsx` کنار هر `page.tsx` بساز
3. API routes باید همیشه error handling کامل داشته باشن
4. تصاویر placeholder را از `/public/images/placeholder/` بخوان
5. هیچ secret را در کد commit نکن — همه از `.env` بخوان
