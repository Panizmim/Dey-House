interface ChairIllustrationProps {
  color?: string
  opacity?: number
  className?: string
}

const ChairIllustration = ({
  color = '#801A00',
  opacity = 1,
  className = '',
}: ChairIllustrationProps) => (
  <svg
    viewBox="0 0 900 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    {/* خط مورب از صندلی به سمت چپ */}
    <line x1="155" y1="210" x2="880" y2="265" stroke={color} strokeWidth="1.2" />

    {/* پشتی صندلی */}
    <rect x="72" y="42" width="82" height="68" rx="4"
      fill="none" stroke={color} strokeWidth="2" />
    {/* خط داخل پشتی */}
    <rect x="80" y="50" width="66" height="52" rx="3"
      fill="none" stroke={color} strokeWidth="1.2" />

    {/* نشیمن */}
    <rect x="66" y="118" width="94" height="16" rx="3"
      fill="none" stroke={color} strokeWidth="2" />
    {/* خط داخل نشیمن */}
    <rect x="73" y="123" width="80" height="6" rx="2"
      fill="none" stroke={color} strokeWidth="1" />

    {/* پایه‌های جلو */}
    <line x1="78" y1="134" x2="68" y2="220"
      stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="148" y1="134" x2="158" y2="220"
      stroke={color} strokeWidth="2" strokeLinecap="round" />

    {/* پایه‌های عقب (مورب — تاشو) */}
    <line x1="88" y1="134" x2="52" y2="220"
      stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="138" y1="134" x2="174" y2="220"
      stroke={color} strokeWidth="2" strokeLinecap="round" />

    {/* اتصال پایه‌ها */}
    <line x1="52" y1="220" x2="174" y2="220"
      stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="68" y1="220" x2="158" y2="220"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" />

    {/* تقویت وسط پایه‌ها */}
    <line x1="60" y1="180" x2="166" y2="180"
      stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export default ChairIllustration
