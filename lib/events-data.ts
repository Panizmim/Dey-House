export interface EventItem {
  id: string
  slug: string
  title: string
  type: string
  date: string
  time: string
  location: string
  description: string
  gradient: string
  imageUrl?: string
}

export const events: EventItem[] = [
  {
    id: '1',
    slug: 'namaeshgah-honarmanadan-moaser',
    title: 'نمایشگاه آثار هنرمندان معاصر',
    type: 'نمایشگاه',
    date: '۱۵ خرداد ۱۴۰۴',
    time: '۱۶:۰۰ تا ۲۱:۰۰',
    location: 'گالری خانه دی',
    description:
      'گردهمایی آثار ۱۲ هنرمند برجسته در گالری خانه دی — تجربه‌ای از نقاشی، عکاسی و چیدمان معاصر.\n\nاین نمایشگاه فرصتی است برای آشنایی با جریان‌های تازه هنر معاصر ایران. آثار نمایش‌داده‌شده شامل نقاشی، عکاسی هنری و چیدمان تعاملی می‌شود.\n\nورود برای عموم آزاد است.',
    gradient: 'linear-gradient(135deg, #c8d4b8, #6b8c5a)',
  },
  {
    id: '2',
    slug: 'teatr-tajrobi-astaneh',
    title: 'تئاتر تجربی «آستانه»',
    type: 'تئاتر',
    date: '۲۲ خرداد ۱۴۰۴',
    time: '۱۹:۳۰',
    location: 'پلاتو اصلی',
    description:
      'یک اجرای تئاتری تجربی که مرزهای فضا و زمان را به چالش می‌کشد.\n\nگروه تئاتر «آستانه» با یک اجرای بدون متن ثابت، مخاطب را در فضایی سیال و غیرخطی قرار می‌دهد. هر شب اجرا متفاوت است.\n\nظرفیت محدود — رزرو از طریق تماس با خانه دی.',
    gradient: 'linear-gradient(135deg, #d4c8e8, #7a5aa8)',
  },
  {
    id: '3',
    slug: 'shab-sher-moaser',
    title: 'شب شعر معاصر',
    type: 'ادبی',
    date: '۰۵ تیر ۱۴۰۴',
    time: '۲۰:۰۰',
    location: 'سالن اصلی',
    description:
      'شبی با صدای شاعران معاصر ایران در فضای صمیمی خانه دی.\n\nچهار شاعر از نسل‌های مختلف شعر فارسی در یک شب گرد هم می‌آیند. خوانش شعر، گفتگو و موسیقی زنده بخشی از این برنامه است.\n\nورود آزاد است.',
    gradient: 'linear-gradient(135deg, #c8e8d4, #4a9870)',
  },
  {
    id: '4',
    slug: 'workshop-aksasi',
    title: 'ورکشاپ عکاسی پرتره',
    type: 'ورکشاپ',
    date: '۱۲ تیر ۱۴۰۴',
    time: '۱۰:۰۰ تا ۱۶:۰۰',
    location: 'استودیو عکاسی',
    description:
      'آموزش تکنیک‌های پیشرفته عکاسی پرتره با مدرس حرفه‌ای.\n\nدر این ورکشاپ ۶ ساعته با نورپردازی طبیعی و مصنوعی، پُست‌پروداکشن و زبان بدن در عکاسی پرتره آشنا می‌شوید.\n\nظرفیت: ۱۲ نفر. همراه داشتن دوربین الزامی است.',
    gradient: 'linear-gradient(135deg, #e8d4c8, #a87860)',
  },
  {
    id: '5',
    slug: 'concert-musiqi-dastgahi',
    title: 'کنسرت موسیقی دستگاهی',
    type: 'موسیقی',
    date: '۲۰ تیر ۱۴۰۴',
    time: '۱۸:۰۰',
    location: 'فضای کافه',
    description:
      'یک شب موسیقی اصیل ایرانی در فضای گرم کافه خانه دی.\n\nنوازندگان سه‌تار، تار و آواز در یک فضای صمیمی و نزدیک با مخاطبان اجرا خواهند داشت. این کنسرت با رویکرد «موسیقی در فضاهای کوچک» برگزار می‌شود.\n\nظرفیت محدود است.',
    gradient: 'linear-gradient(135deg, #e8e8c8, #a8a860)',
  },
]
