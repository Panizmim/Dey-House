import NextAuth from 'next-auth'

// نسخه سبک برای middleware — بدون Prisma، بدون bcrypt
// فقط برای خواندن JWT کافی است
export const { auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [],
  callbacks: {
    async jwt({ token }) {
      return token
    },
    async session({ session, token }) {
      session.user.id    = (token.id as string) || token.sub || ''
      session.user.role  = (token.role as string) || 'USER'
      session.user.phone = (token.phone as string) || ''
      return session
    },
  },
})
