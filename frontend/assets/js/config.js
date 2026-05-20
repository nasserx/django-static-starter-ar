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
  endpoints: {
    trialSignup: '/api/trial',
    login: '/api/auth/login',
    register: '/api/auth/register',
    oauthGoogle: '/api/auth/google',
  },
};

window.APP_CONTENT = window.APP_CONTENT || {
  brand: {
    name: 'منصتك',
    copyright: '© 2026 منصتك. جميع الحقوق محفوظة.',
  },

  navigation: {
    links: [
      { label: 'الرئيسية', href: 'index.html#hero', active: true },
      { label: 'المميزات', href: 'index.html#features' },
      { label: 'باقات الاشتراك', href: 'index.html#pricing' },
      { label: 'مركز المساعدة', href: 'index.html#help' },
    ],
    loginLabel: 'دخول',
    themeToggleLabel: 'تبديل الوضع',
    menuToggleLabel: 'فتح القائمة',
  },

  hero: {
    id: 'hero',
    eyebrow: 'قالب SaaS احترافي',
    titlePrefix: 'ابتكر',
    titleSuffix: '. انمُ. وحقّق الكفاءة.',
    lead: 'قالب مسطّح، أنيق، وجاهز للإنتاج — يمنحك أساسًا قويًا لإطلاق تطبيقك السحابي بأي اتجاه: تحليلات، تعليم، خدمات، تجارة، أو منتج ذكي.',
    trialForm: {
      id: 'emailForm',
      action: '/trial',
      method: 'POST',
      endpointKey: 'trialSignup',
      inputName: 'email',
      inputLabel: 'البريد الإلكتروني',
      inputPlaceholder: 'أدخل بريدك الإلكتروني',
      submitLabel: 'ابدأ مجانًا',
      loadingLabel: 'جارٍ التحضير...',
      successLabel: 'تحقّق من بريدك',
    },
    note: 'ابدأ ببريدك الإلكتروني فقط — بدون بطاقة ائتمان.',
    preview: {
      label: 'عرض تفاعلي · نموذج',
      badge: 'معاينة',
      messages: [
        'اعرض ميزات تطبيقك بشكل تفاعلي هنا.',
        'دعم الرسوم البيانية والبيانات الحية.',
        'واجهة ذكية تتكيف مع احتياجاتك.',
        'بساطة في التصميم، قوة في الأداء.',
      ],
    },
  },

  features: {
    id: 'features',
    eyebrow: 'المميزات',
    title: 'قالب بُني لتُسرّع كل خطوة',
    description: 'ثلاث ركائز جاهزة للاستخدام، تختصر أسابيع من العمل المبدئي.',
    items: [
      {
        icon: 'spark',
        title: 'تصميم مسطّح وعصري',
        description: 'واجهة نقيّة بحدود واضحة، خالية تمامًا من الظلال والتدرّجات، تنقل احترافية وتركيزًا على المحتوى.',
      },
      {
        icon: 'bolt',
        title: 'أداء عالي بلا تنازلات',
        description: 'قالب خفيف بحجم بضعة كيلوبايتات، يعمل بدون مكتبات أو حزم بناء — تحميل فوري وتجربة سلسة.',
      },
      {
        icon: 'rings',
        title: 'واجهة تتكيّف مع احتياجاتك',
        description: 'وضعان فاتح وداكن مدمجان، توكنات تصميم موحّدة، ومحتوى حيّ قابل للتعديل من مكان واحد.',
      },
    ],
  },

  stats: {
    id: 'stats',
    eyebrow: 'بالأرقام',
    title: 'ثقة تنمو مع كل فريق ينضمّ',
    description: 'أرقام عيّنة جاهزة للاستبدال بمؤشّرات منصّتك الحقيقية.',
    items: [
      { value: '+50,000', label: 'مستخدم نشط' },
      { value: '99.9%', label: 'توفّر الخدمة' },
      { value: '+120', label: 'دولة حول العالم' },
      { value: '4.9★', label: 'متوسط التقييم' },
    ],
  },

  testimonials: {
    id: 'testimonials',
    eyebrow: 'آراء العملاء',
    title: 'قصص فِرق تختار العمل بذكاء',
    description: 'كلمات من مستخدمين حقيقيين، يعكسون أثر القالب في يومهم.',
    items: [
      {
        quote: 'قالب نظيف ومرتّب من ناحية الكود والتصميم. اختصر علينا أسابيع، ووفّر لنا قاعدة احترافية ننطلق منها مباشرة.',
        avatar: 'ل',
        name: 'ليلى الزهراني',
        role: 'مديرة منتج',
      },
      {
        quote: 'أكثر ما أعجبني الالتزام بالبساطة — لا ظلال، لا تأثيرات زائدة، فقط واجهة عربية مرتّبة تليق بأي منتج جاد.',
        avatar: 'خ',
        name: 'خالد الدوسري',
        role: 'مهندس واجهات أمامية',
      },
    ],
  },

  pricing: {
    id: 'pricing',
    eyebrow: 'باقات الاشتراك',
    title: 'باقة لكل مرحلة من رحلتك',
    description: 'ابدأ مجانًا، وارفع باقتك متى توسّع فريقك. تسعير شفاف، بدون مفاجآت.',
    plans: [
      {
        name: 'للبدء',
        title: 'الخطة المجانية',
        description: 'جرّب التجربة كاملة قبل أن تلتزم بأي شيء.',
        amount: 'مجاني',
        unit: 'إلى الأبد<br>للفرق الصغيرة',
        features: ['حتى 3 أعضاء في الفريق', 'لوحات أداء أساسية', 'الدعم عبر المجتمع'],
        cta: { label: 'ابدأ مجانًا', href: '#hero' },
        footnote: 'بدون بطاقة ائتمان.',
      },
      {
        featured: true,
        tag: 'الأكثر شيوعًا',
        name: 'للفِرق المتنامية',
        title: 'الخطة الاحترافية',
        description: 'كل الأدوات التي تحتاجها لتوسيع فريقك وقياس أثر كل قرار.',
        amount: '49',
        unit: 'ر.س<br>شهريًا لكل عضو',
        features: ['أعضاء فريق بلا حدود', 'تحليلات وأتمتة متقدّمة', 'تكامل مع أكثر من 50 أداة', 'دعم بالأولوية على مدار الساعة'],
        cta: { label: 'اشترك الآن', auth: true },
        footnote: 'يمكنك الإلغاء في أي وقت.',
      },
    ],
  },

  help: {
    id: 'help',
    eyebrow: 'مركز المساعدة',
    title: 'الأسئلة الأكثر شيوعًا',
    description: 'إجابات سريعة تساعدك على البدء بثقة.',
    faqs: [
      { question: 'كيف تعمل التجربة المجانية؟', answer: 'تستطيع تجربة كل أدوات المنصّة لفترة 14 يومًا بدون أي قيود، وبدون الحاجة إلى بطاقة ائتمان. بعد انتهاء الفترة، اختر الباقة التي تناسبك أو استمرّ على الخطة المجانية.', open: true },
      { question: 'هل أحتاج إلى بطاقة ائتمان للتسجيل؟', answer: 'لا. التسجيل يتمّ بالبريد الإلكتروني فقط. تطلب البطاقة فقط عند الترقية إلى خطّة مدفوعة، ويمكنك الإلغاء في أي وقت من إعدادات الحساب.' },
      { question: 'هل تدعمون التكامل مع الأدوات الأخرى؟', answer: 'نعم. تتكامل المنصّة مع أكثر من 50 أداة شائعة، ولدينا API مفتوح لأي تكامل مخصّص يحتاجه فريقك.' },
      { question: 'ما مستوى الدعم الذي أحصل عليه؟', answer: 'الخطة المجانية تحصل على دعم عبر مركز المعرفة والمجتمع. الخطة الاحترافية تحصل على دعم بالأولوية عبر البريد والدردشة المباشرة، 24/7.' },
      { question: 'هل بياناتي آمنة؟', answer: 'نلتزم بأعلى معايير الأمان: تشفير البيانات أثناء النقل وفي السكون، شهادة SOC 2، نسخ احتياطية يومية، ومراكز بيانات إقليمية لضمان السيادة وسرعة الوصول.' },
    ],
    contact: {
      title: 'لم تجد إجابتك؟',
      subtitle: 'راسلنا مباشرة، نرد عادة خلال ساعة في ساعات العمل.',
      label: 'تواصل مع الدعم',
      href: 'mailto:hello@example.com',
    },
  },

  finalCta: {
    title: 'جاهز لإطلاق منصّتك القادمة؟',
    description: 'ابدأ مجانًا اليوم — بدون بطاقة ائتمان، بدون التزام، وانضمّ إلى آلاف الفِرق التي تختار العمل بذكاء.',
    label: 'ابدأ مجانًا الآن',
    href: '#hero',
  },

  footer: {
    columns: [
      {
        title: 'الشركة',
        links: [
          { label: 'من نحن', href: 'index.html#hero' },
          { label: 'المميزات', href: 'index.html#features' },
          { label: 'قصص النجاح', href: 'index.html#testimonials' },
          { label: 'المدوّنة', href: '#' },
        ],
      },
      {
        title: 'الدعم',
        links: [
          { label: 'مركز المساعدة', href: 'index.html#help' },
          { label: 'الأسئلة الشائعة', href: 'index.html#help' },
          { label: 'دليل البدء', href: '#' },
          { label: 'تواصل معنا', href: '#' },
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
  revealSelector: '.feature-card, .stat-card, .testimonial-card, .price-card, .faq-item, .section-head, .help-contact',
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
