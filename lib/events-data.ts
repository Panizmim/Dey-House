export interface EventItem {
  id:             string
  slug:           string
  title:          string
  type:           string
  organizer:      string
  date:           string
  endDate?:       string
  time:           string
  location:       string
  description:    string
  gradient:       string
  isActive:       boolean
  imageUrl?:      string
  images:         string[]
  imageGradients: string[]
  previousEvents: string[]
}

export const events: EventItem[] = [
  {
    id:          '1',
    slug:        'namaeshgah-honarmanadan-moaser',
    title:       'نمایشگاه آثار هنرمندان معاصر',
    type:        'نمایشگاه',
    organizer:   'گروهی',
    date:        '۱۵ خرداد ۱۴۰۴',
    endDate:     '۲۵ خرداد ۱۴۰۴',
    time:        '۱۶:۰۰ تا ۲۱:۰۰',
    location:    'گالری خانه دی، تهران',
    isActive:    true,
    description:
      'گردهمایی آثار ۱۲ هنرمند برجسته در گالری خانه دی — تجربه‌ای از نقاشی، عکاسی و چیدمان معاصر.\n\nاین نمایشگاه فرصتی است برای دیدار با آثاری که از دل تجربه‌های زیسته هنرمندان بیرون آمده‌اند. هر اثر داستانی دارد که منتظر شنیده شدن است.\n\nمخاطبان می‌توانند در طول بازه برگزاری از شنبه تا پنج‌شنبه ساعت ۱۶ تا ۲۱ و جمعه‌ها ۱۴ تا ۲۰ از نمایشگاه بازدید کنند.',
    gradient:    'linear-gradient(135deg, #1a3a2a, #2d5a3a)',
    imageUrl:    '/images/events/event1-poster.jpg',
    images: [
      '/images/events/event1-1.jpg',
      '/images/events/event1-2.jpg',
      '/images/events/event1-3.jpg',
      '/images/events/event1-4.jpg',
    ],
    imageGradients: [
      'linear-gradient(135deg, #c8d4b8, #6b8c5a)',
      'linear-gradient(135deg, #d4c8e8, #7a5aa8)',
      'linear-gradient(135deg, #c8e8d4, #4a9870)',
      'linear-gradient(135deg, #e8d4c8, #a87860)',
    ],
    previousEvents: ['teatr-tajrobi-astaneh', 'shab-sher-moaser'],
  },
  {
    id:          '2',
    slug:        'teatr-tajrobi-astaneh',
    title:       'تئاتر تجربی «آستانه»',
    type:        'تئاتر',
    organizer:   'فردی',
    date:        '۲۲ خرداد ۱۴۰۴',
    time:        '۱۹:۳۰',
    location:    'پلاتو اصلی خانه دی، تهران',
    isActive:    true,
    description:
      'یک اجرای تئاتری تجربی که مرزهای فضا و زمان را به چالش می‌کشد.\n\nگروه تئاتر «آستانه» با یک اجرای بدون متن ثابت، مخاطب را در فضایی سیال و غیرخطی قرار می‌دهد. هر شب اجرا متفاوت است.\n\nظرفیت محدود — رزرو از طریق تماس با خانه دی.',
    gradient:    'linear-gradient(135deg, #1a0a2a, #2d1a4a)',
    imageUrl:    '/images/events/event2-poster.jpg',
    images: [
      '/images/events/event2-1.jpg',
      '/images/events/event2-2.jpg',
      '/images/events/event2-3.jpg',
      '/images/events/event2-4.jpg',
    ],
    imageGradients: [
      'linear-gradient(135deg, #c8b8e8, #6050a0)',
      'linear-gradient(135deg, #e8c8d4, #a05878)',
      'linear-gradient(135deg, #b8c0e8, #5060a8)',
      'linear-gradient(135deg, #d4b8e8, #7848a8)',
    ],
    previousEvents: ['namaeshgah-honarmanadan-moaser', 'shab-sher-moaser'],
  },
  {
    id:          '3',
    slug:        'shab-sher-moaser',
    title:       'شب شعر معاصر — صدای امروز',
    type:        'ادبی',
    organizer:   'گروهی',
    date:        '۰۵ تیر ۱۴۰۴',
    time:        '۲۰:۰۰',
    location:    'سالن اصلی خانه دی، تهران',
    isActive:    false,
    description:
      'شبی با صدای شاعران معاصر ایران در فضای صمیمی خانه دی.\n\nچهار شاعر از نسل‌های مختلف شعر فارسی در یک شب گرد هم می‌آیند. خوانش شعر، گفتگو و موسیقی زنده بخشی از این برنامه است.\n\nورود آزاد است.',
    gradient:    'linear-gradient(135deg, #0a1a2a, #1a2d4a)',
    imageUrl:    '/images/events/event3-poster.jpg',
    images: [
      '/images/events/event3-1.jpg',
      '/images/events/event3-2.jpg',
      '/images/events/event3-3.jpg',
      '/images/events/event3-4.jpg',
    ],
    imageGradients: [
      'linear-gradient(135deg, #b8c8e8, #4860a8)',
      'linear-gradient(135deg, #c8d8f0, #6080c0)',
      'linear-gradient(135deg, #b0c0e0, #4058a0)',
      'linear-gradient(135deg, #c0d0f0, #5870b8)',
    ],
    previousEvents: ['namaeshgah-honarmanadan-moaser', 'concert-musiqi-dastgahi'],
  },
  {
    id:          '4',
    slug:        'workshop-aksasi',
    title:       'ورکشاپ عکاسی پرتره پیشرفته',
    type:        'ورکشاپ',
    organizer:   'فردی',
    date:        '۱۲ تیر ۱۴۰۴',
    time:        '۱۰:۰۰ تا ۱۶:۰۰',
    location:    'استودیو عکاسی خانه دی، تهران',
    isActive:    false,
    description:
      'آموزش تکنیک‌های پیشرفته عکاسی پرتره با مدرس حرفه‌ای.\n\nدر این ورکشاپ ۶ ساعته با نورپردازی طبیعی و مصنوعی، پُست‌پروداکشن و زبان بدن در عکاسی پرتره آشنا می‌شوید.\n\nظرفیت: ۱۲ نفر. همراه داشتن دوربین الزامی است.',
    gradient:    'linear-gradient(135deg, #2a1a0a, #4a2d1a)',
    imageUrl:    '/images/events/event4-poster.jpg',
    images: [
      '/images/events/event4-1.jpg',
      '/images/events/event4-2.jpg',
      '/images/events/event4-3.jpg',
      '/images/events/event4-4.jpg',
    ],
    imageGradients: [
      'linear-gradient(135deg, #e8d4b8, #a07848)',
      'linear-gradient(135deg, #f0e0c0, #b08858)',
      'linear-gradient(135deg, #d8c8a8, #907040)',
      'linear-gradient(135deg, #e0d0b8, #a88050)',
    ],
    previousEvents: ['shab-sher-moaser', 'namaeshgah-honarmanadan-moaser'],
  },
  {
    id:          '5',
    slug:        'concert-musiqi-dastgahi',
    title:       'کنسرت موسیقی دستگاهی ایرانی',
    type:        'موسیقی',
    organizer:   'گروهی',
    date:        '۲۰ تیر ۱۴۰۴',
    time:        '۱۸:۰۰',
    location:    'فضای کافه خانه دی، تهران',
    isActive:    true,
    description:
      'یک شب موسیقی اصیل ایرانی در فضای گرم کافه خانه دی.\n\nنوازندگان سه‌تار، تار و آواز در یک فضای صمیمی و نزدیک با مخاطبان اجرا خواهند داشت.\n\nظرفیت محدود است.',
    gradient:    'linear-gradient(135deg, #2a2a0a, #4a4a1a)',
    imageUrl:    '/images/events/event5-poster.jpg',
    images: [
      '/images/events/event5-1.jpg',
      '/images/events/event5-2.jpg',
      '/images/events/event5-3.jpg',
      '/images/events/event5-4.jpg',
    ],
    imageGradients: [
      'linear-gradient(135deg, #e8e0b8, #a09840)',
      'linear-gradient(135deg, #f0e8c8, #b0a858)',
      'linear-gradient(135deg, #d8d0a0, #908830)',
      'linear-gradient(135deg, #e0d8b0, #a8a048)',
    ],
    previousEvents: ['teatr-tajrobi-astaneh', 'shab-sher-moaser'],
  },
  {
    id:          '6',
    slug:        'namaeshgah-naghashi',
    title:       'نمایشگاه نقاشی «ریشه»',
    type:        'نمایشگاه',
    organizer:   'فردی',
    date:        '۰۱ مرداد ۱۴۰۴',
    time:        '۱۵:۰۰ تا ۲۰:۰۰',
    location:    'گالری خانه دی، تهران',
    isActive:    false,
    description:
      'بررسی هویت و ریشه‌های فرهنگی از دریچه نقاشی.\n\nهنرمند این نمایشگاه با استفاده از تکنیک‌های ترکیبی و مواد اولیه طبیعی، روایتی از هویت ایرانی ارائه می‌دهد.\n\nورود برای عموم آزاد است.',
    gradient:    'linear-gradient(135deg, #2a0a0a, #4a1a1a)',
    imageUrl:    '/images/events/event6-poster.jpg',
    images: [
      '/images/events/event6-1.jpg',
      '/images/events/event6-2.jpg',
      '/images/events/event6-3.jpg',
      '/images/events/event6-4.jpg',
    ],
    imageGradients: [
      'linear-gradient(135deg, #e8b8b8, #a04040)',
      'linear-gradient(135deg, #f0c8c8, #b05858)',
      'linear-gradient(135deg, #d8a8a8, #903030)',
      'linear-gradient(135deg, #e0b8b8, #a84848)',
    ],
    previousEvents: ['namaeshgah-honarmanadan-moaser', 'concert-musiqi-dastgahi'],
  },
]
