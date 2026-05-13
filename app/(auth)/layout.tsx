import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'خانه دی',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-heavy text-brand">خانه دی</span>
            </div>
          </a>
        </div>
        {children}
      </div>
    </div>
  )
}
