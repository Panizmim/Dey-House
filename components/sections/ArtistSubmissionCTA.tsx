import Link from 'next/link'

export function ArtistSubmissionCTA() {
  return (
    <div className="max-w-container mx-auto text-center">
      <h2 className="text-2xl font-[900] text-neutral-900 mb-3">همکاری هنرمندان</h2>
      <p className="text-neutral-500 text-base font-light mb-8 max-w-md mx-auto leading-loose">
        اگر هنرمند هستید و می‌خواهید فضا، مخاطب و فرصت اجرا داشته باشید، با ما تماس بگیرید.
      </p>
      <Link
        href="/artist"
        className="inline-block font-[700] text-sm transition-colors duration-200 hover:opacity-70"
        style={{
          border: '1px solid #8B1E1E',
          borderRadius: '8px',
          padding: '12px 28px',
          color: '#8B1E1E',
        }}
      >
        ارسال درخواست همکاری
      </Link>
    </div>
  )
}
