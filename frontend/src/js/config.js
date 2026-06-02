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
    oauthGoogle: '/api/auth/google',
  },
};

window.APP_CONTENT = window.APP_CONTENT || {
  brand: {
    name: 'منصتك',
    href: 'index.html',
    copyright: '© 2026 منصتك. قالب بداية قابل للتخصيص.',
  },

  navigation: {
    links: [
      { label: 'الرئيسية', href: 'index.html', sectionId: 'hero', active: true },
      { label: 'المميزات', href: 'index.html#features', sectionId: 'features' },
      { label: 'نماذج الخطط', href: 'index.html#pricing', sectionId: 'pricing' },
    ],
    loginLabel: 'دخول',
    themeToggleLabel: 'تبديل الوضع',
    menuToggleLabel: 'فتح القائمة',
  },

  hero: {
    id: 'hero',
    eyebrow: 'قالب عربي قابل لإعادة الاستخدام',
    titlePrefix: 'ابدأ مشروعك',
    titleSuffix: ' بواجهة عربية جاهزة',
    lead: 'منصتك قالب بداية عام يجمع واجهة منظمة قابلة للتخصيص مع خلفية Django، لتبدأ مشروعك بسرعة وتستبدل المحتوى بما يناسب فكرتك.',
    trialForm: {
      id: 'emailForm',
      action: '/trial',
      method: 'POST',
      endpointKey: 'trialSignup',
      inputName: 'email',
      inputLabel: 'البريد الإلكتروني',
      inputPlaceholder: 'أدخل بريدك الإلكتروني',
      submitLabel: 'جرّب البداية',
      loadingLabel: 'جارٍ التحضير...',
      successLabel: 'تحقّق من بريدك',
    },
    note: 'محتوى الواجهة افتراضي ومعد للاستبدال في مشروعك القادم.',
    preview: {
      label: 'عرض تفاعلي · نموذج',
      badge: 'معاينة',
      messages: [
        'واجهة عربية منظمة كنقطة بداية.',
        'أقسام جاهزة للتعديل والتوسعة.',
        'Django مع HTML وCSS وJavaScript ثابتة.',
      ],
    },
  },

  features: {
    id: 'features',
    eyebrow: 'المميزات',
    title: 'أساس مرن لمشروعك القادم',
    description: 'أقسام جاهزة ومحتوى عام يساعدانك على الانطلاق بسرعة دون الارتباط بمجال محدد.',
    items: [
      {
        icon: 'spark',
        title: 'هوية قابلة للتخصيص',
        description: 'اسم وشعار ونصوص افتراضية محايدة يمكنك استبدالها بما يناسب مشروعك، مع الحفاظ على بنية الواجهة الحالية.',
      },
      {
        icon: 'bolt',
        title: 'واجهة ثابتة خفيفة',
        description: 'HTML وCSS وJavaScript بدون حزم أو خطوة بناء، مناسبة كبداية واضحة للمشاريع العربية الصغيرة والمتوسطة.',
      },
      {
        icon: 'rings',
        title: 'خلفية Django جاهزة',
        description: 'بنية خلفية أساسية مع إعدادات محلية وتكامل قابل للتوسعة، من غير افتراض نموذج عمل أو مجال محدد.',
      },
    ],
  },

  stats: {
    id: 'stats',
    eyebrow: 'لمحة عامة',
    title: 'قالب منظم وسهل التعديل',
    description: 'أرقام توضيحية افتراضية تعرض طريقة استخدام بطاقات المؤشرات داخل الواجهة.',
    items: [
      { value: '٣', label: 'أقسام رئيسية جاهزة' },
      { value: '٢', label: 'نماذج بطاقات قابلة للتبديل' },
      { value: '١', label: 'واجهة عربية ثابتة' },
      { value: '٠', label: 'خطوات بناء للواجهة' },
    ],
  },

  testimonials: {
    id: 'testimonials',
    eyebrow: 'أمثلة محتوى',
    title: 'نصوص افتراضية قابلة للاستبدال',
    description: 'هذه البطاقات تعرض صياغات عامة يمكن تغييرها في أي مشروع يعتمد على القالب.',
    items: [
      {
        quote: 'وفّر القالب نقطة بداية واضحة للواجهة، ثم استبدلنا النصوص بما يناسب المشروع.',
        avatar: 'م',
        name: 'مثال أول',
        role: 'محتوى افتراضي',
      },
      {
        quote: 'ساعدتنا البنية الثابتة على تجربة الفكرة بسرعة قبل إضافة تفاصيل المجال لاحقًا.',
        avatar: 'ن',
        name: 'مثال ثانٍ',
        role: 'محتوى قابل للتعديل',
      },
    ],
  },

  pricing: {
    id: 'pricing',
    eyebrow: 'نماذج الخطط',
    title: 'بطاقات خطط افتراضية للتخصيص',
    description: 'هذه البطاقات أمثلة شكلية داخل القالب، وليست عروض بيع أو أسعارًا حقيقية. استبدلها بما يناسب مشروعك.',
    plans: [
      {
        name: 'بداية',
        title: 'نموذج أساسي',
        description: 'مثال لبطاقة بداية يمكن استخدامها لعرض نسخة بسيطة من مشروعك.',
        amount: 'مثال',
        unit: 'قابل للتعديل',
        features: ['نصوص افتراضية', 'أقسام قابلة للتخصيص'],
        cta: { label: 'استخدم النموذج', href: 'index.html' },
        footnote: 'محتوى توضيحي فقط.',
      },
      {
        featured: true,
        tag: 'مثال مميز',
        name: 'نمو',
        title: 'نموذج متقدم',
        description: 'مثال لبطاقة أكثر بروزًا عند الحاجة إلى إبراز خيار افتراضي داخل الواجهة.',
        amount: 'نموذج',
        unit: 'بدون سعر حقيقي',
        features: ['محتوى بديل جاهز', 'مساحة لوصف المزايا', 'دعوة إجراء قابلة للتعديل', 'تصميم البطاقة محفوظ'],
        cta: { label: 'خصّص هذا الخيار', auth: true },
        footnote: 'استبدله بخطة أو عرض مناسب لتطبيقك.',
      },
    ],
  },

  help: {
    id: 'help',
    eyebrow: 'مركز المساعدة',
    title: 'أسئلة سريعة',
    description: 'إجابات مختصرة عن طبيعة القالب وكيفية تخصيص محتواه.',
    faqs: [
      { question: 'هل هذا القالب مرتبط بمجال محدد؟', answer: 'لا. المحتوى الحالي عام ومحايد، ومعد ليكون نقطة بداية لمشاريع عربية مختلفة.', open: true },
      { question: 'هل بطاقات الخطط عروض حقيقية؟', answer: 'لا. هي أمثلة شكلية للحفاظ على تصميم البطاقات، ويمكن استبدالها بأي محتوى مناسب.' },
      { question: 'ما التقنية المستخدمة في الواجهة؟', answer: 'الواجهة ثابتة وتعتمد على HTML وCSS وJavaScript بدون حزم أو خطوة بناء.' },
      { question: 'كيف أخصص النصوص؟', answer: 'ابدأ من ملف إعدادات الواجهة واستبدل النصوص الافتراضية باسم مشروعك ورسائله.' },
    ],
    contact: {
      title: 'تحتاج تخصيصًا؟',
      subtitle: 'استبدل هذه المساحة بطريقة التواصل المناسبة لمشروعك.',
      label: 'تواصل معنا',
      href: 'mailto:hello@example.com',
    },
  },

  finalCta: {
    title: 'ابدأ من قالب عربي جاهز',
    description: 'استخدم منصتك كأساس عام، ثم أضف هوية مشروعك ومحتواه ووظائفه الخاصة لاحقًا.',
    label: 'ابدأ التخصيص',
    href: 'index.html',
  },

  footer: {
    columns: [
      {
        title: 'المنصة',
        links: [
          { label: 'الرئيسية', href: 'index.html' },
          { label: 'المميزات', href: 'index.html#features' },
          { label: 'نماذج الخطط', href: 'index.html#pricing' },
        ],
      },
      {
        title: 'القالب',
        links: [
          { label: 'نموذج أساسي', href: 'index.html#pricing' },
          { label: 'نموذج متقدم', href: 'index.html#pricing' },
          { label: 'واجهة قابلة للتخصيص', href: 'index.html#features' },
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
