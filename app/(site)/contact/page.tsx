import PageHero from '@/components/ui/PageHero'

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="تماس با ما"
        subtitle="در تماس باشید"
      />
      <div className="max-w-[860px] mx-auto px-8 py-16">
        <p className="text-[#404040]" style={{ fontSize: '15px', lineHeight: 2 }}>
          برای ارتباط با خانه دی از طریق شبکه‌های اجتماعی یا ایمیل info@deyhouse.ir با ما در تماس باشید.
        </p>
      </div>
    </>
  )
}
