import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // تشخیص HTTPS بر اساس URL واقعی request (نه NODE_ENV)
  const secureCookies = req.url.startsWith('https://')
  const cookieName = secureCookies
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token'

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: secureCookies,
    cookieName,
    salt: cookieName,   // next-auth v5: salt = cookie name برای JWE
  })

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const url = new URL('/login', req.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
