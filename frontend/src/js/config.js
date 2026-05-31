/*
 * config.js
 * ---------------------------------------------------------------------------
 * Backend handoff layer. Replace these objects with server-rendered values,
 * JSON injected into the page, or an API response without touching components.
 *
 * Django/Jinja examples:
 *   brand.name: '{{ brand_name }}'
 *   trialForm.action: '{% url "trial_signup" %}'
 *   API_BASE_URL: '{{ api_base_url }}'
 */
window.APP_CONFIG = window.APP_CONFIG || {
  API_BASE_URL: '#',
  BACKEND_API_BASE_URL: 'http://127.0.0.1:8000',
  endpoints: {
    trialSignup: '/api/trial',
    csrf: '/api/auth/csrf/',
    me: '/api/auth/me/',
    login: '/api/auth/login/',
    logout: '/api/auth/logout/',
    register: '/api/auth/register/',
    forgotPassword: '/api/auth/forgot-password',
    oauthGoogle: '/api/auth/google',
  },
};

window.APP_CONTENT = window.APP_CONTENT || {
  brand: {
    name: 'قياس الحاسب',
    href: 'index.html',
    copyright: '© 2026 قياس الحاسب. جميع الحقوق محفوظة.',
  },

  navigation: {
    links: [
      { label: 'الرئيسية', href: 'index.html', sectionId: 'hero', active: true },
      { label: 'المميزات', href: 'index.html#features', sectionId: 'features' },
      { label: 'باقات الاشتراك', href: 'index.html#pricing', sectionId: 'pricing' },
    ],
    loginLabel: 'دخول',
    themeToggleLabel: 'تبديل الوضع',
    menuToggleLabel: 'فتح القائمة',
  },

  hero: {
    id: 'hero',
    eyebrow: 'اختبارات قياس الحاسب',
    titlePrefix: 'اختبر جاهزيتك',
    titleSuffix: ' لرخصة الحاسب',
    lead: 'اختبارات أقرب لأسلوب الاختبار الفعلي، تساعدك على قياس مستواك ومعرفة أين تركز.',
    trialForm: {
      id: 'emailForm',
      action: '/trial',
      method: 'POST',
      endpointKey: 'trialSignup',
      inputName: 'email',
      inputLabel: 'البريد الإلكتروني',
      inputPlaceholder: 'أدخل بريدك الإلكتروني',
      submitLabel: 'ابدأ الآن',
      loadingLabel: 'جارٍ التحضير...',
      successLabel: 'تحقّق من بريدك',
    },
    note: 'ابدأ بالخطة المجانية وتعرّف على أسلوب الاختبار قبل الترقية.',
    preview: {
      label: 'عرض تفاعلي · نموذج',
      badge: 'معاينة',
      messages: [
        'أقرب لطبيعة الاختبار الفعلي.',
        'تركيز على المجالات التقنية.',
        'اعرف أين تقف قبل الاختبار.',
      ],
    },
  },

  features: {
    id: 'features',
    eyebrow: 'المميزات',
    title: 'استعداد أوضح قبل الاختبار',
    description: 'محتوى مختصر ومباشر يساعدك على قياس جاهزيتك وتحديد أولويات المراجعة.',
    items: [
      {
        icon: 'spark',
        title: 'أقرب لطبيعة الاختبار الفعلي',
        description: 'اختبارات مصممة لتقارب طبيعة الاختبار الحقيقي، من حيث توزيع المعايير ومستويات الصعوبة المتوقعة، بعيدًا عن التجميعات العشوائية.',
      },
      {
        icon: 'bolt',
        title: 'تركيز على المجالات التقنية',
        description: 'محتوى يغطي المجالات التقنية: الحاسب والرياضيات، هندسة الحاسب، علوم الحاسب، وتطبيقات الحاسب، والتي تشكل ٧١٪ من معايير الاختبار.',
      },
      {
        icon: 'rings',
        title: 'اعرف أين تقف',
        description: 'لوحة أداء بسيطة تساعدك على قياس مستواك بوضوح، ومعرفة أولويات المراجعة قبل الاختبار.',
      },
    ],
  },

  stats: {
    id: 'stats',
    eyebrow: 'نطاق التركيز',
    title: 'استعداد مبني على معايير الاختبار',
    description: 'مؤشرات مختصرة توضّح ما تركّز عليه تجربة الاختبارات.',
    items: [
      { value: '٧١٪', label: 'من المعايير في المجالات التقنية' },
      { value: '٣', label: 'اختبارات شهرية في الخطة المجانية' },
      { value: '٦', label: 'اختبارات كاملة في الخطة المتقدمة' },
      { value: '١٩', label: 'شهريًا للخطة المتقدمة' },
    ],
  },

  testimonials: {
    id: 'testimonials',
    eyebrow: 'تجارب المتدربين',
    title: 'استعداد أوضح قبل الاختبار',
    description: 'آراء مختصرة من متدربين استخدموا الاختبارات لتحديد أولويات المراجعة.',
    items: [
      {
        quote: 'ساعدتني الاختبارات على معرفة المجالات التي تحتاج مراجعة أكثر قبل موعد الاختبار.',
        avatar: 'ل',
        name: 'ليان',
        role: 'متدربة',
      },
      {
        quote: 'التحليل بعد الاختبار جعل المراجعة أكثر وضوحًا وتركيزًا.',
        avatar: 'خ',
        name: 'خالد',
        role: 'متدرب',
      },
    ],
  },

  pricing: {
    id: 'pricing',
    eyebrow: 'باقات الاشتراك',
    title: 'اختر الخطة المناسبة لاستعدادك',
    description: 'ابدأ مجانًا للتجربة، أو اشترك شهريًا لاختبارات أكثر وتحليل أوضح للأداء.',
    plans: [
      {
        name: 'للبدء',
        title: 'الخطة المجانية',
        description: 'لتجربة المنصة والتعرف على أسلوب الاختبار قبل الترقية.',
        amount: 'مجانًا',
        unit: '',
        features: ['٣ اختبارات شهريًا', 'مراجعة الإجابات'],
        cta: { label: 'ابدأ مجانًا', href: 'index.html' },
        footnote: '',
      },
      {
        featured: true,
        tag: 'اشتراك شهري',
        name: 'اشتراك شهري',
        title: 'الخطة المتقدمة',
        description: 'لمن يريد استعدادًا أوسع مع اختبارات أكثر وتحليل أوضح للأداء.',
        amount: '١٩',
        unit: 'شهريًا',
        features: ['٦ اختبارات كاملة شهريًا', 'مراجعة الإجابات', 'تحليل الأداء', 'تتبع التقدم'],
        cta: { label: 'اشترك الآن', auth: true },
        footnote: '',
      },
    ],
  },

  help: {
    id: 'help',
    eyebrow: 'مركز المساعدة',
    title: 'أسئلة سريعة',
    description: 'إجابات مختصرة عن طريقة استخدام الاختبارات وخطط الاشتراك.',
    faqs: [
      { question: 'ماذا تشمل الخطة المجانية؟', answer: 'تشمل ٣ اختبارات شهريًا مع مراجعة الإجابات، لتجربة المنصة والتعرف على أسلوب الاختبار.', open: true },
      { question: 'ماذا تضيف الخطة المتقدمة؟', answer: 'تضيف ٦ اختبارات كاملة شهريًا، مع مراجعة الإجابات، تحليل الأداء، وتتبع التقدم.' },
      { question: 'هل الاختبارات مطابقة تمامًا للاختبار الفعلي؟', answer: 'الاختبارات مصممة لتقارب طبيعة الاختبار الحقيقي من حيث توزيع المعايير ومستويات الصعوبة المتوقعة، لكنها ليست نسخة رسمية من الاختبار.' },
      { question: 'على ماذا يركز المحتوى؟', answer: 'يركز على المجالات التقنية: الحاسب والرياضيات، هندسة الحاسب، علوم الحاسب، وتطبيقات الحاسب.' },
    ],
    contact: {
      title: 'تحتاج مساعدة؟',
      subtitle: 'راسلنا إذا كان لديك سؤال عن الخطط أو الاختبارات.',
      label: 'تواصل معنا',
      href: 'mailto:hello@example.com',
    },
  },

  finalCta: {
    title: 'اختبر جاهزيتك لرخصة الحاسب',
    description: 'ابدأ بالخطة المجانية، ثم انتقل للخطة المتقدمة عندما تحتاج اختبارات أكثر وتحليلًا أوضح.',
    label: 'ابدأ الآن',
    href: 'index.html',
  },

  footer: {
    columns: [
      {
        title: 'المنصة',
        links: [
          { label: 'الرئيسية', href: 'index.html' },
          { label: 'المميزات', href: 'index.html#features' },
          { label: 'باقات الاشتراك', href: 'index.html#pricing' },
        ],
      },
      {
        title: 'الاستعداد',
        links: [
          { label: 'الخطة المجانية', href: 'index.html#pricing' },
          { label: 'الخطة المتقدمة', href: 'index.html#pricing' },
          { label: 'مراجعة الإجابات', href: 'index.html#features' },
        ],
      },
      {
        title: 'قانوني',
        links: [
          { label: 'شروط الاستخدام', href: '#' },
          { label: 'سياسة الخصوصية', href: '#' },
          { label: 'سياسة الاسترداد', href: '#' },
          { label: 'حماية البيانات', href: '#' },
        ],
      },
    ],
  },
};

window.SHOWCASE_MESSAGES = window.SHOWCASE_MESSAGES || window.APP_CONTENT.hero.preview.messages;

window.APP_CONSTANTS = window.APP_CONSTANTS || {
  desktopQuery: '(min-width: 769px)',
  modalCloseDelay: 160,
  showcaseInterval: 4000,
  showcaseFadeDelay: 320,
};

window.AUTH_PROVIDERS = window.AUTH_PROVIDERS || [
  {
    id: 'google',
    label: 'المتابعة باستخدام Google',
    endpointKey: 'oauthGoogle',
    icon: [
      '<svg class="provider-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
      '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>',
      '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>',
      '<path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>',
      '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"/>',
      '</svg>',
    ].join(''),
  },
];
