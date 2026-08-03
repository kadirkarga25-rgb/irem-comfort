import { CollectionItem, CraftsmanshipStep, WhyUsCard, ContactInfo, FaqItem } from '../types';

export const BRAND_NAME = "İrem Comfort";
export const BRAND_TAGLINE = "Hakiki Deri Bayan Comfort Sandalet & Terlik İmalatı";
export const BRAND_ESTABLISHED = "1994";

export const CONTACT_DATA: ContactInfo = {
  phone: "+905330297125",
  phoneDisplay: "0533 029 71 25",
  whatsapp: "905330297125",
  whatsappDisplay: "0533 029 71 25",
  instagram: "@irem.comfort",
  instagramUrl: "https://www.instagram.com/irem.comfort",
  instagramVerified: true,
  email: "info@iremcomfort.com",
  address: "Manisa Ayakkabıcılar Sitesi (Güzelyurt Mahallesi) 5757.Sokak No:21/A Yunusemre / Manisa 45030",
  showroomHours: "Pzt - Cmt: 08:30 - 19:00 | Pazar: Özel Randevu İle",
  trendyolUrl: "https://www.trendyol.com/magaza/irem-comfort-m-1286942?sst=0&channelId=1"
};

export const ANNOUNCEMENT_TICKER = [
  "YENİ SEZON HAKİKİ DERİ BAYAN COMFORT SANDALET VE TERLİK KOLEKSİYONU ÇIKTI",
  "TRENDYOL RESMİ MAĞAZAMIZ AÇILDI — ONLİNE ALIŞVERİŞ İÇİN BİZE ULAŞIN",
  "ANATOMİK TABANLI YUMUŞAK SAYA BAYAN TERLİK VE SABO İMALATI",
  "YENİ SEZON KATALOĞU VE TOPTAN / PERAKENDE BİLGİ HATTI: 0533 029 71 25",
  "MANİSA AYAKKABICILAR SİTESİ ÜRETİM ATÖLYEMİZDEN DOĞRUDAN DANIŞMA"
];

export const COLLECTION_ITEMS: CollectionItem[] = [
  {
    id: 'cift-tokali-comfort-terlik',
    name: 'İrem Comfort Çift Tokalı Hakiki Deri Terlik',
    subtitle: 'Anatomik Yumuşak Tabanlı Bayan Terliği',
    category: 'Bayan Comfort Terlik',
    tagline: 'Gün boyu yumuşak adımlar için %100 hakiki deri saya ve esnek taban',
    description: 'İrem Comfort un en çok tercih edilen klasiği. Ayarlanabilir metal kemer tokaları sayesinde her ayak tipine mükemmel uyum sağlar. Hakiki deri iç ve dış kaplaması terlemeyi önler, anatomik taban desteğiyle gün boyu konfor sunar.',
    image: 'https://images.unsplash.com/photo-1603808033176-9d134e6f2c74?auto=format&fit=crop&q=80&w=1200',
    secondaryImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200',
    materials: ['%100 Hakiki Yumuşak Dana Derisi', 'Anatomik Poliüretan Taban', 'Hakiki Deri İç Astar'],
    dimensions: 'Numara Aralığı: 36 - 41 | Taban Yüksekliği: 3.5 cm',
    leatherGrades: ['Yumuşak Hakiki Nappa', 'Anilin Hakiki Deri'],
    colors: [
      { name: 'Siyah Klasik', hex: '#1C1C1C' },
      { name: 'Taba Bronz', hex: '#8B5A2B' },
      { name: 'Vizon Krem', hex: '#D2C4B2' },
      { name: 'Beyaz Saf', hex: '#FFFFFF' }
    ],
    features: [
      'Anatomik kavisli özel taban desteği',
      '%100 Nefes alan hakiki deri iç kaplama',
      'Paslanmaz ayarlanabilir metal tokalar',
      'Hafif ve darbe emici poliüretan taban'
    ],
    isFeatured: true
  },
  {
    id: 'ortopedik-sabo-terlik',
    name: 'İrem Comfort Hakiki Deri Ortopedik Sabo Terlik',
    subtitle: 'Nefes Alan Gözenekli İş ve Günlük Terliği',
    category: 'Sabo & Ortopedik Terlik',
    tagline: 'Sağlık çalışanları ve ayakta çalışan kadınlar için özel konfor',
    description: 'Uzun saatler ayakta kalan kadınlar için özel olarak geliştirilmiş ortopedik sabo modeli. Lamine hakiki deri saya üzerindeki özel hava delikleri sirkülasyon sağlar. Özel pedli dolgulu tabanı topuk ve bel yükünü hafifletir.',
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=1200',
    secondaryImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1200',
    materials: ['Perfore Hakiki Deri', 'Ortopedik Jel Pedli Taban', 'Kaymaz Taban Kaplaması'],
    dimensions: 'Numara Aralığı: 36 - 41 | Topuk Yüksekliği: 4.5 cm',
    leatherGrades: ['Perfore Hava Delikli Deri'],
    colors: [
      { name: 'Beyaz Medikal', hex: '#F8F9FA' },
      { name: 'Gece Siyahı', hex: '#111111' },
      { name: 'Lacivert', hex: '#0A2D6F' }
    ],
    features: [
      'Topuk dikeni ve nasır önleyici ortopedik iç taban',
      'Sürekli havalandırma sağlayan perfore saya',
      'Islak ve kuru zeminlerde kaymayan taban',
      'Kolay temizlenebilir leke tutmaz hakiki deri'
    ],
    isFeatured: true
  },
  {
    id: 'capraz-bant-sandalet',
    name: 'İrem Comfort Çapraz Bantlı Hakiki Deri Sandalet',
    subtitle: 'Zarif & Şık Yazlık Bayan Sandalet',
    category: 'Bayan Comfort Sandalet',
    tagline: 'Yazın sıcak günlerinde hem şıklık hem anatomik konfor',
    description: 'Yumuşacık çapraz deri bantları ve bilekten cırtlı/tokalı kilit mekanizması ile ayağı güvenle sarar. Ayak tabanının doğal yapısını destekleyen hafif esnek tabanı sayesinde uzun yürüyüşlerde yorgunluk hissettirmez.',
    image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&q=80&w=1200',
    secondaryImage: 'https://images.unsplash.com/photo-1603808033176-9d134e6f2c74?auto=format&fit=crop&q=80&w=1200',
    materials: ['Süper Yumuşak Dana Derisi', 'Anatomik Esnek Taban', 'Deri Kaplı Soft Tabanlık'],
    dimensions: 'Numara Aralığı: 36 - 40 | Taban Yüksekliği: 3 cm',
    leatherGrades: ['Nappa Yumuşak Deri'],
    colors: [
      { name: 'Konyak Taba', hex: '#9E5B2B' },
      { name: 'Gece Siyahı', hex: '#111111' },
      { name: 'Kum Beji', hex: '#E2D3C1' }
    ],
    features: [
      'Bileği rahatsız etmeyen özel yumuşatılmış deri bantlar',
      'Sürtünmeyi ve vurmayı önleyen kesintisiz dikiş yapısı',
      'Esnek ve hafif ergonomik yazlık taban',
      'Şok emici topuk dolgusu'
    ],
    isFeatured: true
  },
  {
    id: 'mantar-taban-comfort-terlik',
    name: 'İrem Comfort Doğal Mantar Taban Hakiki Deri Terlik',
    subtitle: 'Hakiki Süet Astar Kaplamalı Anatomik Terlik',
    category: 'Mantar Taban Terlik',
    tagline: 'Doğal mantar esnekliği ve süet dokusunun eşsiz uyumu',
    description: 'Doğal mantar ve kauçuk karışımı özel tabanlık, giyildikçe ayağınızın formunu alarak kişiselleştirilmiş bir konfor sunar. Üst saya hakiki deriden üretilmiş olup iç tabanlığı hakiki süet deri ile kaplanmıştır.',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1200',
    secondaryImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200',
    materials: ['Hakiki Deri Saya', 'Doğal Mantar-Lateks Taban', 'Hakiki Süet İç Astar'],
    dimensions: 'Numara Aralığı: 36 - 41 | Taban Yüksekliği: 2.5 cm',
    leatherGrades: ['Hakiki Deri & Süet Astar'],
    colors: [
      { name: 'Toprak Taba', hex: '#8B5A2B' },
      { name: 'Zeytin Yeşili', hex: '#556B2F' },
      { name: 'Mat Siyah', hex: '#2B2B2B' }
    ],
    features: [
      'Ayağın şeklini alan doğal mantar taban çekirdeği',
      'Nem emici hakiki süet deri iç kaplama',
      'Kaymayı önleyen alt kauçuk EVA taban',
      'Ayarlanabilir kemer tokası'
    ],
    isFeatured: true
  },
  {
    id: 'dolgu-topuk-sandalet',
    name: 'İrem Comfort Dolgu Topuk Hakiki Deri Sandalet',
    subtitle: 'Ortopedik Dolgu Tabanlı Şık Sandalet',
    category: 'Bayan Comfort Sandalet',
    tagline: 'Yükseklik ve zarafet arayanlar için dengeli dolgu taban',
    description: 'Ayağı yormayan ideal eğime sahip dolgu topuklu özel tasarım. Ön bantlarındaki yumuşatılmış deri kaplama parmak sürtünmelerini engeller. Hem günlük elbiselerle hem şık kombinlerle rahatça kullanılabilir.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200',
    secondaryImage: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&q=80&w=1200',
    materials: ['Hakiki Deri Saya', 'Hafif Poliüretan Dolgu Taban', 'Soft Pedli Tabanlık'],
    dimensions: 'Numara Aralığı: 36 - 40 | Topuk Yüksekliği: 6 cm (Ön Platform: 2 cm)',
    leatherGrades: ['Nappa & Anilin Deri'],
    colors: [
      { name: 'Asil Siyah', hex: '#111111' },
      { name: 'Altın Vizon', hex: '#C5A059' },
      { name: 'Sütlü Kahve', hex: '#8C6D58' }
    ],
    features: [
      'Ağırlığı öne bindirmeyen dengeli dolgu kalıbı',
      'Yumuşak sünger destekli deri iç taban',
      'Bileği sağlam kavrayan esnek tokalı bant',
      'Sarsıntı önleyici hafif poliüretan gövde'
    ]
  },
  {
    id: 'cirt-cirtli-genis-terlik',
    name: 'İrem Comfort Cırt Cırtlı Genişletilebilir Comfort Terlik',
    subtitle: 'Taraklı & Hassas Ayaklar İçin Özel Terlik',
    category: 'Bayan Comfort Terlik',
    tagline: 'Ödemli veya taraklı ayaklar için kolayca genişleyen hakiki deri',
    description: 'Ayağında tarak, ödem veya hassasiyet bulunan kadınlar için özel olarak tasarlanmıştır. Geniş cırt bantları sayesinde ayağın şişliğine göre milimetrik olarak ayarlanabilir. İçi ekstra yumuşak jel dolguludur.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1200',
    secondaryImage: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=1200',
    materials: ['Geniş Esnek Hakiki Deri', 'Jel Dolgulu Anatomik Taban', 'Cırt Cırtlı Bant'],
    dimensions: 'Numara Aralığı: 36 - 41 | Taban Yüksekliği: 3.5 cm',
    leatherGrades: ['Yumuşak Hakiki Deri'],
    colors: [
      { name: 'Bordo Gül', hex: '#800020' },
      { name: 'Klasik Siyah', hex: '#1C1C1C' },
      { name: 'Bej Bronz', hex: '#D2B48C' }
    ],
    features: [
      'Milimetrik cırt cırt genişlik ayarı',
      'Taraklı ve hassas ayaklara tam uyum',
      'Darbe emici jel destekli iç tabanık',
      'Ekstra esnek yan deri kaplamalar'
    ]
  }
];

export const CRAFTSMANSHIP_STEPS: CraftsmanshipStep[] = [
  {
    number: '01',
    title: 'Hakiki Deri Seçimi',
    subtitle: 'En Üst Kalite Anilin & Nappa Dana Derileri',
    description: 'İrem Comfort imalatında sadece yumuşak, gözenekli ve nefes alan %100 hakiki deri tabakaları seçilir. Sentetik kaplamalı suni deriler kesinlikle imalathanemize giremez.',
    detailPoints: [
      '%100 Hakiki dana ve kuzu derisi saya kalitesi',
      'Nefes alabilen terleme ve koku önleyici gözenekler',
      'Ayak yapısına hızla esneyip uyum sağlayan yumuşak doku',
      'Yırtılma ve dikiş mukavemet testlerinden geçmiş hakiki deriler'
    ],
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000',
    iconName: 'ShieldCheck'
  },
  {
    number: '02',
    title: 'Hassas Kesim ve Saya Dikişi',
    subtitle: 'Manisa Atölyemizde Usta Zanaatkarların Dokunuşu',
    description: 'Seçilen deriler ayakkabı kalıplarına uygun olarak milimetrik hassasiyetle kesilir. Saya parçaları dayanıklı iplerle elde ve özel dikiş makinelerinde titizlikle birleştirilir.',
    detailPoints: [
      'Ayağı vurmayan gizli dikiş ve biye teknikleri',
      'Aşınmaya dayanıklı yüksek mukavemetli iplikler',
      'Ayarlanabilir kemer ve tokalı montaj detayları',
      'Her numaraya özel anatomik saya kalıp uyumu'
    ],
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000',
    iconName: 'Sparkles'
  },
  {
    number: '03',
    title: 'Anatomik Taban Montajı',
    subtitle: 'Ortopedik Kavis ve Jel Ped Desteği',
    description: 'Terlik ve sandaletlerimizin rahatlığının kalbinde anatomik taban teknolojisi yatar. Ayak kavislerini destekleyen poliüretan ve mantar tabanlıklar saya ile birleştirilir.',
    detailPoints: [
      'Aksis ve kavis destekli anatomik iç tabanlık',
      'Topuk dikeni ve nasır baskısını azaltan özel jel dolgu',
      'Darbe ve sarsıntıları emen esnek poliüretan alt taban',
      'Kaymaz alt taban deseni'
    ],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000',
    iconName: 'Cpu'
  },
  {
    number: '04',
    title: 'Final Kalite Kontrolü',
    subtitle: 'Manisa Ayakkabıcılar Sitesi İmalat Güvencesi',
    description: 'Üretim bandından çıkan her bir terlik ve sandalet teker teker incelenir. Deri yüzeyi temizlenir, kalıp kontrolleri yapılır ve ambalajlanarak sevkiyata hazırlanır.',
    detailPoints: [
      'Dikiş, yapıştırma ve taban mukavemet kontrolü',
      'Çiftler arası renk ve ton uyum incelemesi',
      'Doğal deri bakım spreyi ile parlaklık verme',
      '%100 Yerli İmalat ve Üretici Güvencesi'
    ],
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1000',
    iconName: 'Award'
  }
];

export const WHY_US_CARDS: WhyUsCard[] = [
  {
    id: 'leather',
    title: '%100 Hakiki Deri',
    subtitle: 'Kaliteli Saya & İç Astar',
    description: 'Tüm bayan comfort terlik ve sandaletlerimizde %100 hakiki deri kullanıyoruz. Nefes alan yapısıyla koku ve terlemeyi önler.',
    metric: '%100',
    metricLabel: 'Hakiki Deri Garantisi',
    iconName: 'Layers'
  },
  {
    id: 'handcrafted',
    title: 'Manisa İmalatı',
    subtitle: 'Ayakkabıcılar Sitesi Atölyesi',
    description: 'Manisa Ayakkabıcılar Sitesindeki atölyemizde tecrübeli ustalarımız tarafından doğrudan imal edilir. Aracı olmadan üretici kalitesi sunuyoruz.',
    metric: 'Manisa',
    metricLabel: 'Yerli İmalat Atölyesi',
    iconName: 'Hammer'
  },
  {
    id: 'comfort',
    title: 'Anatomik Konfor',
    subtitle: 'Ortopedik Taban Desteği',
    description: 'Ayağın doğal kavislerine uyum sağlayan özel tabanlıklar sayesinde gün boyu ayakta kalsanız dahi yorgunluk hissetmezsiniz.',
    metric: 'Anatomik',
    metricLabel: 'Yumuşak Taban',
    iconName: 'HeartPulse'
  },
  {
    id: 'design',
    title: 'Zamansız Model Seçenekleri',
    subtitle: 'Sandalet, Sabo & Terlik',
    description: 'Çift tokalı klasiklerden ortopedik sabo ve yazlık sandaletlere kadar zengin model ve renk çeşitliliği sunuyoruz.',
    metric: 'Zengin',
    metricLabel: 'Renk & Model Çeşitliliği',
    iconName: 'Compass'
  },
  {
    id: 'quality',
    title: 'Toptan & Perakende',
    subtitle: 'Müşteri Memnuniyeti Güvencesi',
    description: 'Türkiye genelinde mağaza tedariği, toptan satış ve perakende sipariş imkanı ile doğrudan imalatçı avantajı.',
    metric: 'İmalatçı',
    metricLabel: 'Doğrudan Sipariş',
    iconName: 'ShieldCheck'
  }
];

export const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'toptan',
    question: 'Toptan terlik ve sandalet siparişi için minimum seri/kutu adedi nedir?',
    answer: 'Toptan siparişlerinizde standart seri paketimiz 8 veya 10 çiftten oluşmaktadır (36-41 numara arası). Mağazalar ve bayilerimiz için minimum 1 seri (paket) sipariş verme imkanı sunuyoruz.',
    isPopular: true,
    isActive: true
  },
  {
    id: 'faq-2',
    category: 'toptan',
    question: 'Kendi markamız veya özel renk/model üretimi yaptırabilir miyiz?',
    answer: 'Evet. Yeterli seri adetlerindeki fason ve özel üretim taleplerinizde kendi etiketiniz veya firmamıza özel renk/saya kombinasyonları ile Manisa atölyemizde imalat gerçekleştirmekteyiz.',
    isPopular: false,
    isActive: true
  },
  {
    id: 'faq-3',
    category: 'toptan',
    question: 'Toptan fiyat kataloğunuzu nasıl temin edebilirim?',
    answer: 'İletişim sayfamızdaki WhatsApp butonuna tıklayarak veya 0533 029 71 25 numaramızdan müşteri temsilcimize firma/mağaza bilginizi ileterek güncel toptan fiyat kataloğumuzu talep edebilirsiniz.',
    isPopular: true,
    isActive: true
  },
  {
    id: 'faq-4',
    category: 'kargo',
    question: 'Toptan ve perakende siparişlerde kargo teslim süresi ne kadardır?',
    answer: 'Stokta hazır bulunan modellerimiz aynı gün veya en geç 24 saat içerisinde kargoya verilir. Türkiye içi tüm şehirlere anlaşmalı kargo firmalarımızla ortalama 1-3 iş günü içerisinde teslimat sağlanır.',
    isPopular: true,
    isActive: true
  },
  {
    id: 'faq-5',
    category: 'kargo',
    question: 'Yurtdışına gönderim ve mikro ihrakat yapıyor musunuz?',
    answer: 'Evet. Başta Ortadoğu, Balkanlar, Avrupa ve Türki Cumhuriyetler olmak üzere uluslararası mikro ihracat ve kargo gönderim servislerimiz mevcuttur.',
    isPopular: false,
    isActive: true
  },
  {
    id: 'faq-6',
    category: 'kargo',
    question: 'Siparişimin kargo takibini nasıl yapabilirim?',
    answer: 'Siparişiniz kargo firmasına teslim edildiğinde tarafınıza SMS ve WhatsApp bilgilendirme mesajı gönderilir. Ayrıca iletişim hattımızdan anlık durum sorgulayabilirsiniz.',
    isPopular: false,
    isActive: true
  },
  {
    id: 'faq-7',
    category: 'bakim',
    question: '%100 Hakiki deri terlik ve sandaletlerin temizliği ve bakımı nasıl yapılmalıdır?',
    answer: 'Hakiki deri ürünler nemli ve hafif sabunlu yumuşak bir bezle silinerek temizlenmelidir. Derinin doğal nem dengesini ve esnekliğini koruması için direkt güneş ışığı veya kalörifer yanında kurutulmamalı, oda sıcaklığında kurumaya bırakılmalıdır. Dönem dönem şeffaf deri bakım kremi sürülmesi ömrünü uzatır.',
    isPopular: true,
    isActive: true
  },
  {
    id: 'faq-8',
    category: 'bakim',
    question: 'Deri terlikler ıslanırsa ne yapılmalıdır?',
    answer: 'Suyla temas halinde ürünü fön makinesi veya radyatör gibi yüksek ısı kaynaklarına maruz bırakmayın. İçine kağıt havlu koyarak gölgede kurumaya bırakın. Kuruduktan sonra doğal deri besleyici krem uygulayabilirsiniz.',
    isPopular: false,
    isActive: true
  },
  {
    id: 'faq-9',
    category: 'bakim',
    question: 'Anatomik deri iç taban terleme veya koku yapar mı?',
    answer: 'İrem Comfort ürünlerimizin iç astar ve taban kaplamasında %100 doğal gözenekli hakiki deri kullanılır. Sentetik ve plastik astarların aksine ayağın hava almasını sağlar, terleme ve kokuyu en aza indirir.',
    isPopular: true,
    isActive: true
  },
  {
    id: 'faq-10',
    category: 'kalip',
    question: 'İrem Comfort terlik ve sandaletlerin kalıpları tam mıdır?',
    answer: 'Ürünlerimiz standart Türk ayak anatomisine tam (regular fit) uyumludur. Günlük hayatınızda sürekli giydiğiniz ayakkabı/terlik numaranızı tercih edebilirsiniz. Taraklı veya yüksek kavisli ayaklar için cırtlı ve tokalı ayarlanabilir modellerimiz ekstra konfor sağlar.',
    isPopular: true,
    isActive: true
  },
  {
    id: 'faq-11',
    category: 'kalip',
    question: 'Numara değişimi veya iade hakkım var mıdır?',
    answer: 'Kullanılmamış ve orijinal kutusu muhafaza edilen perakende siparişlerinizde 14 gün içerisinde numara değişimi veya iade imkanı sunmaktayız.',
    isPopular: false,
    isActive: true
  }
];


