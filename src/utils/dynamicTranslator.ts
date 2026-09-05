import { Language, HeroConfig, CraftsmanshipStep, FaqItem, AboutSlide, CollectionItem } from '../types';

// Translation mappings for dynamic admin-controlled data
export const DYNAMIC_HERO_TRANSLATIONS: Record<'en' | 'ar', Partial<HeroConfig>> = {
  en: {
    badgeText: "Est. 1993 • Manufactured in Manisa Footwear Industrial Estate",
    title: "Women's Comfort Genuine Leather Sandals & Slippers.",
    description: "100% Genuine leather uppers, orthopedic anatomical curved soles, and master craftsmanship from our Manisa workshop. Discover our new season collection delivering all-day lightness and elegance.",
    primaryBtnText: "Explore Collection",
    secondaryBtnText: "Our Workshop",
    signatureModelTitle: "Double-Buckle Genuine Leather Slipper",
    signatureModelSub: "Soft Calfskin Leather Upper • Anatomical Soft Comfort Sole"
  },
  ar: {
    badgeText: "تأسست ١٩٩٣ • صناعة ورش مانيسا للأحذية الجلدية",
    title: "صنادل وشباشب نسائية مريحة من الجلد الطبيعي.",
    description: "جلد طبيعي ١٠٠٪، نعل طبّي مريح، وحرفية عالية من ورشتنا في مانيسا. اكتشف تشكيلة الموسم الجديد لخفة وراحة طوال اليوم.",
    primaryBtnText: "استكشف المجموعة",
    secondaryBtnText: "ورشتنا",
    signatureModelTitle: "شبشب من الجلد الطبيعي بمشبك مزدوج",
    signatureModelSub: "وجه من جلد البقر الناعم • نعل طبي مريح للغاية"
  }
};

export const DYNAMIC_CRAFTSMANSHIP_TRANSLATIONS: Record<'en' | 'ar', Record<string, Partial<CraftsmanshipStep>>> = {
  en: {
    '01': {
      title: "Genuine Leather Selection",
      subtitle: "Premium Aniline & Nappa Calfskin",
      description: "Only soft, porous and breathable 100% genuine calfskin and lambskin hides are selected for Irem Comfort production. Artificial and synthetic leathers are strictly excluded.",
      detailPoints: [
        "100% Genuine calfskin and lambskin upper quality",
        "Breathable, sweat and odor-reducing micro-pores",
        "Supple texture that contours naturally to foot anatomy",
        "Tear and stitch resistance tested premium leathers"
      ]
    },
    '02': {
      title: "Precision Cutting & Stitching",
      subtitle: "Master Craftsmanship in Our Manisa Workshop",
      description: "Selected leather hides are cut with millimeter precision matching anatomical lasts. Upper segments are carefully united by hand and specialized leather machinery.",
      detailPoints: [
        "Anti-chafing hidden seams and smooth edge piping",
        "High-tensile wear-resistant reinforced threads",
        "Adjustable strap and rust-proof buckle detailing",
        "Anatomical mold match custom tailored for every size"
      ]
    },
    '03': {
      title: "Anatomical Sole Assembly",
      subtitle: "Orthopedic Arch & Gel Cushion Support",
      description: "At the heart of our comfort lies anatomical sole technology. Polyurethane and natural cork footbeds supporting foot arches are seamlessly bonded to the uppers.",
      detailPoints: [
        "Metatarsal and longitudinal arch supportive inner sole",
        "Special gel layer mitigating heel spur and callus pressure",
        "Shock-absorbing flexible polyurethane outer sole",
        "Slip-resistant traction tread pattern"
      ]
    },
    '04': {
      title: "Final Quality Inspection",
      subtitle: "Manisa Footwear Industrial Estate Manufacturer Guarantee",
      description: "Every single pair coming off our production line is inspected individually. Leather surfaces are conditioned, lasting checks completed, and packaged securely for dispatch.",
      detailPoints: [
        "Stitch, bond and sole strength rigorous inspection",
        "Color tone and texture symmetry validation",
        "Natural leather conditioning and protective finish",
        "100% Domestic Manufacturing & Factory Direct Guarantee"
      ]
    }
  },
  ar: {
    '01': {
      title: "اختيار الجلد الطبيعي",
      subtitle: "أفضل أنواع جلد البقر والماعز الفاخر",
      description: "يتم في تصنيع إيريم كومفورت اختيار جلود طبيعية ١٠٠٪ مسامية وطرية تسمح بتهوية القدمين. يمنع تماماً استخدام الجلود الاصطناعية والبلاستيكية.",
      detailPoints: [
        "جودة وجه الحذاء من جلد العجل والماعز الطبيعي ١٠٠٪",
        "مسام طبيعية مانعة للتعرق ومقاومة للروائح الكريهة",
        "ملمس ناعم يتكيف بسرعة مع شكل وحركة القدم",
        "جلود خضعت لاختبارات المتانة ومقاومة التمزق"
      ]
    },
    '02': {
      title: "القص الدقيق وخياطة الجزء العلوي",
      subtitle: "لمسة الحرفيين الخبراء في ورشتنا بمانيسا",
      description: "تُقص الجلود المختارة بدقة مليمترية لتناسب قوالب الأحذية. تُجمع قطع الجلد بخيوط عالية المتانة بأيدي كبار الحرفيين وماكينات متطورة.",
      detailPoints: [
        "تقنيات خياطة مخفية تمنع احتكاك وجروح القدم",
        "خيوط خياطة عالية المتانة ومقاومة للتآكل",
        "أحزمة قابلة للتعديل وتفاصيل إبزيم دقيقة",
        "توافق قوالب تشريحية مخصصة لكل مقاس"
      ]
    },
    '03': {
      title: "تركيب النعل الطبي التشريحي",
      subtitle: "دعم قوس القدم مع وسادة جل مريحة",
      description: "يكمن سر راحة شباشبنا وصنادلنا في تكنولوجيا النعل الطبي. يتم دمج نعال البولي يوريثان والفلين التي تدعم أقواس القدم مع الجلد العلوي.",
      detailPoints: [
        "نعل داخلي طبي يدعم انحناءات وقوس القدم بالكامل",
        "حشوة جل خاصة تخفف الضغط على مسمار العظم والكعب",
        "نعل خارجي مرن من البولي يوريثان يمتص الصدمات",
        "نقوش نعل مانعة للانزلاق على مختلف الأسطح"
      ]
    },
    '04': {
      title: "مراقبة الجودة النهائية",
      subtitle: "ضمان المصنع المباشر من مانيسا للأحذية",
      description: "يتم فحص كل حذاء وشبشب يخرج من خط الإنتاج بدقة متناهية. يُنظف سطح الجلد وتُفحص القوالب وتُغلّف بأعلى المعايير.",
      detailPoints: [
        "فحص قوة الخياطة والتثبيت ومتانة النعل",
        "مراجعة تطابق وتناغم اللون بين الزوجين",
        "تلميع وترطيب الجلد بزيوت طبيعية واقية",
        "صناعة تركية أصلية ١٠٠٪ وضمان المصنع المباشر"
      ]
    }
  }
};

export const DYNAMIC_ABOUT_SLIDES_TRANSLATIONS: Record<'en' | 'ar', Record<string, Partial<AboutSlide>>> = {
  en: {
    'slide-1': {
      badge: "IREM COMFORT • MANISA",
      title: "Genuine Leather.",
      subtitle: "Natural Comfort.",
      alt: "Irem Comfort Genuine Leather Women Slipper"
    },
    'slide-2': {
      badge: "100% GENUINE UPPER",
      title: "100% Genuine Leather",
      subtitle: "Breathable Soft Calfskin & Lambskin",
      alt: "Manisa Workshop Genuine Leather Texture"
    },
    'slide-3': {
      badge: "MANISA WORKSHOP",
      title: "Handcrafted in Manisa",
      subtitle: "Traditional Stitching Craftsmanship of Master Artisans",
      alt: "Manisa Footwear Industrial Estate Leather Craft"
    },
    'slide-4': {
      badge: "ORTHOPEDIC SOLE",
      title: "Anatomical Comfort",
      subtitle: "Flexible Structure Supporting Natural Foot Arches",
      alt: "Anatomical Orthopedic Sole Architecture"
    }
  },
  ar: {
    'slide-1': {
      badge: "إيريم كومفورت • مانيسا",
      title: "جلد طبيعي.",
      subtitle: "راحة طبيعية.",
      alt: "شبشب وصندل نسائي جلد طبيعي إيريم كومفورت"
    },
    'slide-2': {
      badge: "جلد طبيعي ١٠٠٪",
      title: "جلد طبيعي أصلي ١٠٠٪",
      subtitle: "جلد بقر وماعز ناعم يتنفس",
      alt: "ملمس الجلد الطبيعي من ورشة مانيسا"
    },
    'slide-3': {
      badge: "ورشة مانيسا",
      title: "صُنع في مانيسا - تركيا",
      subtitle: "حرفية الخياطة التقليدية بأيدي أمهر الصناع",
      alt: "حرفية الأحذية الجلدية في مانيسا"
    },
    'slide-4': {
      badge: "نعل طبي مريح",
      title: "راحة تشريحية",
      subtitle: "هيكل مرن يدعم قوس القدم الطبيعي ويخفف التعب",
      alt: "هندسة النعل الطبي التشريحي"
    }
  }
};

export const DYNAMIC_FAQ_TRANSLATIONS: Record<'en' | 'ar', Record<string, Partial<FaqItem>>> = {
  en: {
    'faq-1': {
      question: "Are Irem Comfort products made of 100% genuine leather?",
      answer: "Yes, all our women's slippers, sandals and orthopedic clogs are produced exclusively using 100% first-grade genuine calfskin and lambskin. We never use synthetic, faux or vinyl leather in any part of our shoes."
    },
    'faq-2': {
      question: "Where are your products manufactured?",
      answer: "All our products are manufactured in our own workshop located in Manisa Footwear Industrial Estate (Turkey). With a heritage dating back to 1993, we blend handcrafting traditions with modern ergonomic sole technology."
    },
    'faq-3': {
      question: "How can I place wholesale orders and request catalogs?",
      answer: "For boutique store owners, chain stores and international export orders, you can reach our wholesale department directly via WhatsApp or phone. We will provide our comprehensive digital wholesale catalog, wholesale price tiers and terms."
    },
    'faq-4': {
      question: "What is your minimum order quantity for wholesale?",
      answer: "Our wholesale orders are prepared in standard full-size series (typically sizes 36 to 40). For customized production and private label inquiries, minimum run quantities are evaluated in consultation with our workshop management."
    },
    'faq-5': {
      question: "What makes Irem Comfort anatomical soles orthopedic?",
      answer: "Our soles feature an ergonomic structure that accurately supports the medial arch and metatarsal curves of the human foot. With high shock-absorbing polyurethane foam and cushioned heel gel pads, pressure is evenly distributed across the entire foot."
    },
    'faq-6': {
      question: "How long does shipping and dispatch take?",
      answer: "In-stock orders are carefully packed and handed to shipping couriers within 1-2 business days. For bulk wholesale production and export shipments, delivery schedules are planned and communicated upfront."
    },
    'faq-7': {
      question: "How should I clean and care for genuine leather slippers?",
      answer: "Wipe your leather slippers with a damp cotton cloth. Never wash them in a washing machine or soak in hot water. Applying colorless natural leather balm or beeswax cream once a month preserves softness and extends durability."
    },
    'faq-8': {
      question: "What should I do if my leather sandals get wet?",
      answer: "Never expose wet leather to direct heat sources like hair dryers, heaters or stoves. Place clean paper towels inside and let them dry naturally at room temperature in shade. Apply leather conditioner once completely dry."
    },
    'faq-9': {
      question: "Does the anatomical leather insole cause sweating or odor?",
      answer: "No. The inner lining and footbed in Irem Comfort footwear are crafted from 100% porous genuine leather. Unlike synthetic materials, natural leather breathes continuously, minimizing moisture and odor."
    },
    'faq-10': {
      question: "Are your shoe sizes true to fit?",
      answer: "Our molds are based on standard European sizing (regular fit). We recommend ordering your everyday shoe/slipper size. For wider or high-instep feet, models with adjustable buckle straps provide customized comfort."
    },
    'faq-11': {
      question: "Do you offer size exchanges or returns?",
      answer: "For retail purchases in unworn condition and original packaging, we offer hassle-free size exchanges and returns within 14 days of receipt."
    }
  },
  ar: {
    'faq-1': {
      question: "هل منتجات إيريم كومفورت مصنوعة من جلد طبيعي ١٠٠٪؟",
      answer: "نعم، جميع الشباشب والصنادل والقباقيب الطبية النسائية مصنوعة بالكامل من جلد البقر والماعز الطبيعي ١٠٠٪ من الدرجة الأولى. لا نستخدم الجلد الصناعي أو البلاستيكي إطلاقاً."
    },
    'faq-2': {
      question: "أين يتم تصنيع منتجاتكم؟",
      answer: "تُصنع جميع منتجاتنا في ورشتنا الخاصة في المنطقة الصناعية للأحذية بمدينة مانيسا في تركيا. نجمع بين الخبرة العريقة منذ عام ١٩٩٣ وحرفية اليد مع تكنولوجيا النعل الطبي الحديثة."
    },
    'faq-3': {
      question: "كيف يمكنني تقديم طلبات الجملة وطلب الكتالوج؟",
      answer: "يمكن لأصحاب محلات الأحذية والبوتيكات والمستوردين التواصل مباشرة مع قسم الجملة والتصدير عبر الواتساب أو الهاتف للحصول على الكتالوج الرقمي وقائمة أسعار الجملة."
    },
    'faq-4': {
      question: "ما هو الحد الأدنى لكمية طلبات الجملة؟",
      answer: "يتم إعداد طلبات الجملة في سلاسل مقاسات كاملة قياسية (من مقاس ٣٦ إلى ٤٠). بالنسبة للطلبات الخاصة والإنتاج بالعلامة التجارية الخاصة، يتم تحديد الكميات بالتنسيق مع إدارة الورشة."
    },
    'faq-5': {
      question: "ما الذي يجعل نعل إيريم كومفورت طبياً وتشريحياً؟",
      answer: "يتميز نعلنا بهندسة تشريحية تدعم انحناءات وقوس باطن القدم بدقة. بفضل البولي يوريثان المرن ووسادة الجل المبطنة عند الكعب، يتم توزيع وزن الجسم بالتساوي وتخفيف آلام المفاصل والظهر."
    },
    'faq-6': {
      question: "كم يستغرق الشحن والتسليم؟",
      answer: "يتم تسليم الطلبات المتوفرة لشركات الشحن خلال ١-٢ يوم عمل. أما بالنسبة لطلبات الجملة والتصدير، فيتم تحديد مواعيد الشحن وفق جدول الإنتاج المتفق عليه بدقة."
    },
    'faq-7': {
      question: "كيف أقوم بتنظيف والعناية بشباشب الجلد الطبيعي؟",
      answer: "امسح الجلد بقطعة قماش قطنية رطبة قليلاً. لا تغسلها في الغسالة ولا تنقعها بالماء الساخن. يساعد استخدام كريم أو بلسم الجلد الطبيعي مرة شهرياً في الحفاظ على نعومتها ورونقها لسنوات."
    },
    'faq-8': {
      question: "ماذا أفعل إذا تعرضت الصنادل الجلدية للبلل الشديد؟",
      answer: "تجنب تماماً تعريض الجلد لمصادر الحرارة كالمجففات أو المدافئ. ضع مناديل ورقية بداخلها واتركها تجف في الظل بدرجة حرارة الغرفة، ثم ادهنها بكريم ترطيب الجلد بعد جفافها تماماً."
    },
    'faq-9': {
      question: "هل يسبب نعل الجلد الطبيعي الداخلي التعرق أو الروائح؟",
      answer: "كلا. البطانة الداخلية وسطح النعل في منتجاتنا مصنوعان من جلد طبيعي ١٠٠٪ بمسامات طبيعية. على عكس البلاستيك والجلد الصناعي، يتنفس الجلد الطبيعي ويمنع تراكم الرطوبة والروائح."
    },
    'faq-10': {
      question: "هل مقاسات الشباشب والصنادل دقيقة ومطابقة للمعايير؟",
      answer: "مقاساتنا قياسية ومريحة ومطابقة تماماً للمقاسات الأوروبية القياسية. ننصحك باختيار مقاسك المعتاد في الأحذية اليومية. للأقدام العريضة، توفر موديلاتنا ذات الأحزمة والإبزيم القابلة للتعديل راحة مضاعفة."
    },
    'faq-11': {
      question: "هل يحق لي استبدال المقاس أو الاسترجاع؟",
      answer: "نعم، بالنسبة لطلبات التجزئة التي لم تُستعمل وتم الاحتفاظ بعلبتها الأصلية، نوفر إمكانية استبدال المقاس أو الإرجاع خلال ١٤ يوماً من تاريخ الاستلام."
    }
  }
};

export const DYNAMIC_CATEGORY_TRANSLATIONS: Record<'en' | 'ar', Record<string, string>> = {
  en: {
    'Tümü': 'All Products',
    'Bayan Comfort Terlik': "Women's Comfort Slippers",
    'Bayan Comfort Sandalet': "Women's Comfort Sandals",
    'Sabo & Ortopedik Terlik': 'Orthopedic Clogs & Sabo',
    'Mantar Taban Terlik': 'Cork Footbed Slippers'
  },
  ar: {
    'Tümü': 'جميع المنتجات',
    'Bayan Comfort Terlik': 'شباشب نسائية مريحة',
    'Bayan Comfort Sandalet': 'صنادل نسائية مريحة',
    'Sabo & Ortopedik Terlik': 'قباقيب وشباشب طبية',
    'Mantar Taban Terlik': 'شباشب بنعل فلين طبيعي'
  }
};

export const DYNAMIC_COLOR_TRANSLATIONS: Record<'en' | 'ar', Record<string, string>> = {
  en: {
    'Taba': 'Tan Brown',
    'Siyah': 'Classic Black',
    'Beyaz': 'Pure White',
    'Bej': 'Beige',
    'Vizon': 'Mink',
    'Haki': 'Khaki Green',
    'Kırmızı': 'Red',
    'Lacivert': 'Navy Blue',
    'Pudra': 'Blush Pink',
    'Kahve': 'Chocolate Brown',
    'Platin': 'Platinum',
    'Gümüş': 'Silver',
    'Gold': 'Gold',
    'Hardal': 'Mustard Yellow',
    'Bordo': 'Burgundy',
    'Toprak': 'Earth'
  },
  ar: {
    'Taba': 'بني هافان',
    'Siyah': 'أسود كلاسيكي',
    'Beyaz': 'أبيض ناصع',
    'Bej': 'بيج',
    'Vizon': 'فيزون',
    'Haki': 'زيتي كاكي',
    'Kırmızı': 'أحمر',
    'Lacivert': 'كحلي داكن',
    'Pudra': 'وردي بودري',
    'Kahve': 'بني شوكولاتة',
    'Platin': 'بلاتيني',
    'Gümüş': 'فضي',
    'Gold': 'ذهبي',
    'Hardal': 'خردلي',
    'Bordo': 'خمري بورغندي',
    'Toprak': 'ترابي'
  }
};

export const DYNAMIC_ANNOUNCEMENTS: Record<'en' | 'ar', string[]> = {
  en: [
    "NEW SEASON 100% GENUINE LEATHER WOMEN'S COMFORT SANDAL & SLIPPER COLLECTION",
    "EXPORT & WHOLESALE INQUIRIES HOTLINE: +90 533 029 71 25",
    "HANDCRAFTED DIRECTLY FROM OUR MANISA FOOTWEAR WORKSHOP IN TURKEY",
    "ANATOMICAL ARCH SUPPORT & ORTHOPEDIC COMFORT FOR ALL-DAY WELLBEING"
  ],
  ar: [
    "تشكيلة الموسم الجديد من الشباشب والصنادل النسائية جلد طبيعي ١٠٠٪",
    "خط طلبات الجملة والكتالوج والتصدير المباشر: ٩٠٥٣٣٠٢٩٧١٢٥+",
    "صناعة يدوية مباشرة من ورش مانيسا للأحذية الجلدية في تركيا",
    "نعل طبي مريح يدعم قوس القدم ويوفر راحة فائقة طوال اليوم"
  ]
};

// Helper functions for translating dynamic entities
export function getTranslatedHero(hero: HeroConfig | undefined, lang: Language): HeroConfig {
  const base = hero || {
    badgeText: 'Kuruluş 1993 • Manisa Ayakkabıcılar Sitesi İmalatı',
    title: 'Bayan Comfort Deri Sandalet & Terlik.',
    description: '%100 Hakiki deri saya, ortopedik kavisli anatomik taban ve Manisa atölyemizin usta el işçiliği. Gün boyu adımlarınıza hafiflik ve zarif konfor katan yeni sezon modellerimizi keşfedin.',
    primaryBtnText: 'Koleksiyonu Keşfet',
    secondaryBtnText: 'Atölyemiz',
    signatureModelTitle: 'Çift Tokalı Hakiki Deri Terlik',
    signatureModelSub: 'Yumuşak Dana Derisi Saya • Anatomik Yumuşak Konfor Taban'
  };

  if (lang === 'tr') return base;

  const translation = DYNAMIC_HERO_TRANSLATIONS[lang as 'en' | 'ar'];
  if (!translation) return base;

  return {
    ...base,
    badgeText: translation.badgeText || base.badgeText,
    title: translation.title || base.title,
    description: translation.description || base.description,
    primaryBtnText: translation.primaryBtnText || base.primaryBtnText,
    secondaryBtnText: translation.secondaryBtnText || base.secondaryBtnText,
    signatureModelTitle: translation.signatureModelTitle || base.signatureModelTitle,
    signatureModelSub: translation.signatureModelSub || base.signatureModelSub
  };
}

export function getTranslatedCraftsmanshipSteps(steps: CraftsmanshipStep[], lang: Language): CraftsmanshipStep[] {
  if (lang === 'tr') return steps;

  const langMap = DYNAMIC_CRAFTSMANSHIP_TRANSLATIONS[lang as 'en' | 'ar'];
  if (!langMap) return steps;

  return steps.map((step, idx) => {
    const key = step.number || `0${idx + 1}`;
    const t = langMap[key];
    if (!t) return step;

    return {
      ...step,
      title: t.title || step.title,
      subtitle: t.subtitle || step.subtitle,
      description: t.description || step.description,
      detailPoints: t.detailPoints && t.detailPoints.length > 0 ? t.detailPoints : step.detailPoints
    };
  });
}

export function getTranslatedFaqItems(items: FaqItem[], lang: Language): FaqItem[] {
  if (lang === 'tr') return items;

  const langMap = DYNAMIC_FAQ_TRANSLATIONS[lang as 'en' | 'ar'];
  if (!langMap) return items;

  return items.map(item => {
    const t = langMap[item.id];
    if (!t) return item;

    return {
      ...item,
      question: t.question || item.question,
      answer: t.answer || item.answer
    };
  });
}

export function getTranslatedAboutSlides(slides: AboutSlide[], lang: Language): AboutSlide[] {
  if (lang === 'tr') return slides;

  const langMap = DYNAMIC_ABOUT_SLIDES_TRANSLATIONS[lang as 'en' | 'ar'];
  if (!langMap) return slides;

  return slides.map(slide => {
    const t = langMap[slide.id];
    if (!t) return slide;

    return {
      ...slide,
      title: t.title || slide.title,
      subtitle: t.subtitle || slide.subtitle,
      badge: t.badge || slide.badge,
      alt: t.alt || slide.alt
    };
  });
}

export function getTranslatedCategory(cat: string, lang: Language): string {
  if (lang === 'tr' || !cat) return cat;
  const map = DYNAMIC_CATEGORY_TRANSLATIONS[lang as 'en' | 'ar'];
  return (map && map[cat]) || cat;
}

export function getTranslatedColorName(color: string, lang: Language): string {
  if (lang === 'tr' || !color) return color;
  const map = DYNAMIC_COLOR_TRANSLATIONS[lang as 'en' | 'ar'];
  return (map && map[color]) || color;
}

export function getTranslatedAnnouncements(announcements: string[], lang: Language): string[] {
  if (lang === 'tr') return announcements;
  const mapped = DYNAMIC_ANNOUNCEMENTS[lang as 'en' | 'ar'];
  return mapped || announcements;
}
