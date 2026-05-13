import PageHero from '@/components/ui/PageHero'

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title="گالری"
        subtitle="تصاویر فضاهای خانه دی"
      />
      <div className="max-w-[1000px] mx-auto px-8 py-16">
        <p className="text-[#717171] text-center" style={{ fontSize: '14px' }}>
          به زودی...
        </p>
      </div>
    </>
  )
}
