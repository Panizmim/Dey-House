import type { Metadata } from 'next'

const SITE_URL = 'https://www.deyhouse.com'

export function buildMetadata({
  title,
  description,
  path,
  type = 'website',
}: {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
}): Metadata {
  const url = `${SITE_URL}${path}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: 'خانه دی',
      locale: 'fa_IR',
    },
  }
}
