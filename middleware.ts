import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login?callbackUrl=' + encodeURIComponent(pathname), req.url))
  }
  if (pathname.startsWith('/admin') && session?.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
