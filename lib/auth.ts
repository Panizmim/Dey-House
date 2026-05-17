import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role    = (user as { role?: string }).role
        token.phone   = (user as { phone?: string }).phone
        token.picture = (user as { image?: string | null }).image ?? token.picture
      }
      if (trigger === 'update' && session) {
        if (session.name)  token.name    = session.name
        if (session.image) token.picture = session.image
      }
      return token
    },
    async session({ session, token }) {
      session.user.id    = token.sub ?? ''
      session.user.role  = (token.role as string) ?? ''
      session.user.phone = (token.phone as string) ?? ''
      session.user.image = (token.picture as string | null | undefined) ?? null
      return session
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null
        const user = await db.user.findUnique({ where: { email: parsed.data.email } })
        if (!user || !user.password) return null
        const valid = await bcrypt.compare(parsed.data.password, user.password)
        if (!valid) return null
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          role: user.role as string,
          phone: user.phone ?? '',
        }
      },
    }),
  ],
})
