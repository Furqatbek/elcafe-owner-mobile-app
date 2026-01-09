export default {
  // Common
  common: {
    loading: 'Yuklanmoqda...',
    error: 'Xatolik',
    retry: 'Qayta urinish',
    cancel: 'Bekor qilish',
    save: 'Saqlash',
    delete: "O'chirish",
    edit: 'Tahrirlash',
    confirm: 'Tasdiqlash',
    back: 'Orqaga',
    next: 'Keyingi',
    done: 'Tayyor',
    search: 'Qidirish',
    noData: "Ma'lumot yo'q",
    pullToRefresh: 'Yangilash uchun torting',
    seeAll: 'Barchasi',
    viewAll: "Barchasini ko'rish",
  },

  // Navigation
  navigation: {
    home: 'Asosiy',
    analytics: 'Tahlil',
    inventory: 'Ombor',
    reports: 'Hisobotlar',
    alerts: 'Bildirishnomalar',
  },

  // Login Screen
  login: {
    title: 'Xush kelibsiz',
    subtitle: 'Restoran boshqaruv paneliga kiring',
    email: 'Email',
    emailPlaceholder: 'Emailingizni kiriting',
    password: 'Parol',
    passwordPlaceholder: 'Parolingizni kiriting',
    signIn: 'Kirish',
    signingIn: 'Kirilmoqda...',
    forgotPassword: 'Parolni unutdingizmi?',
    invalidCredentials: "Noto'g'ri email yoki parol",
    networkError: 'Tarmoq xatosi. Qaytadan urinib ko\'ring.',
  },

  // Home Screen
  home: {
    greeting: '{{timeOfDay}}',
    todayOverview: "Bugungi ko'rsatkichlar",
    quickStats: 'Qisqa statistika',
    recentOrders: "So'nggi buyurtmalar",
    topSelling: "Eng ko'p sotilganlar",
    inventoryAlerts: 'Ombor ogohlantirishlari',
    viewDashboard: 'Boshqaruv paneli',
    revenue: 'Daromad',
    orders: 'Buyurtmalar',
    avgOrder: "O'rtacha chek",
    profit: 'Foyda',
    morning: 'Xayrli tong',
    afternoon: 'Xayrli kun',
    evening: 'Xayrli kech',
  },

  // Analytics Screen
  analytics: {
    title: 'Tahlil',
    subtitle: 'Biznes tahlili',
    revenueTrend: 'Daromad dinamikasi',
    salesByCategory: 'Kategoriya bo\'yicha sotuvlar',
    peakHours: "Eng band soatlar",
    topSellingItems: "Eng ko'p sotilganlar",
    revenueByType: "Tur bo'yicha daromad",
    total: 'Jami',
    dailyAvg: "Kunlik o'rtacha",
    peakTime: 'Pik vaqt',
    busiestHours: 'Eng band soatlar',
    dateRange: 'Davr',
    last7Days: "So'nggi 7 kun",
    last30Days: "So'nggi 30 kun",
    thisMonth: 'Bu oy',
    lastMonth: "O'tgan oy",
    custom: 'Tanlash',
  },

  // Inventory Screen
  inventory: {
    title: 'Ombor',
    subtitle: 'Zaxira boshqaruvi',
    stockAlerts: 'Zaxira ogohlantirishlari',
    allItems: 'Barcha mahsulotlar',
    critical: 'Kritik',
    lowStock: 'Kam qoldi',
    reorder: 'Buyurtma qilish',
    inStock: 'Mavjud',
    inventoryMetrics: "Ombor ko'rsatkichlari",
    turnoverRatio: 'Aylanma koeffitsienti',
    daysToSell: 'Sotilish kuni',
    currentStock: 'Joriy zaxira',
    minStock: 'Min. zaxira',
    healthyInventory: "Zaxiralar me'yorda",
    noAlerts: "Zaxira ogohlantirishlari yo'q",
  },

  // Reports Screen
  reports: {
    title: 'Hisobotlar',
    subtitle: 'Moliyaviy tahlil',
    profitLoss: 'Foyda va zararlar',
    customers: 'Mijozlar',
    revenueBreakdown: 'Daromad tarkibi',
    expensesByCategory: "Kategoriya bo'yicha xarajatlar",
    netIncome: 'Sof foyda',
    totalRevenue: 'Jami daromad',
    totalExpenses: 'Jami xarajatlar',
    fromOrders: '{{count}} ta buyurtmadan',
    salesRevenue: 'Sotuv daromadi',
    serviceFees: 'Xizmat to\'lovi',
    deliveryFees: 'Yetkazib berish',
    tips: 'Tip',
    customerRetention: "Mijozlarni ushlab qolish",
    repeatRate: 'Qayta xaridlar',
    churnRate: 'Mijozlar ketishi',
    newCustomers: 'Yangi mijozlar',
    returningCustomers: 'Qaytgan',
    customerLifetimeValue: 'Mijoz umrbod qiymati',
    averageLTV: "O'rtacha LTV",
    avgOrderValue: "O'rtacha chek",
    avgOrdersPerCustomer: 'Buyurtmalar/mijoz',
  },

  // Alerts Screen
  alerts: {
    title: 'Bildirishnomalar',
    subtitle: '{{count}} ta bildirishnoma',
    markAllRead: "Barchasini o'qilgan qilish",
    noNotifications: "Bildirishnomalar yo'q",
    allCaughtUp: "Barchasini o'qib chiqdingiz! Keyinroq qaytib keling.",
    loadingNotifications: 'Bildirishnomalar yuklanmoqda...',
    unableToLoad: "Bildirishnomalarni yuklab bo'lmadi",
    stockAlert: 'Zaxira ogohlantirishi',
    lowStockAlert: 'Kam zaxira',
    financialAlert: 'Moliyaviy',
    orderAlert: 'Buyurtma',
    systemAlert: 'Tizim',
  },

  // Settings
  settings: {
    title: 'Sozlamalar',
    language: 'Til',
    selectLanguage: 'Tilni tanlang',
    english: 'Inglizcha',
    russian: 'Ruscha',
    uzbek: "O'zbekcha",
    notifications: 'Bildirishnomalar',
    pushNotifications: 'Push-bildirishnomalar',
    emailNotifications: 'Email-bildirishnomalar',
    account: 'Hisob',
    profile: 'Profil',
    security: 'Xavfsizlik',
    logout: 'Chiqish',
    logoutConfirm: 'Rostdan ham chiqmoqchimisiz?',
    version: 'Versiya',
  },

  // Time & Date
  time: {
    justNow: 'hozirgina',
    minutesAgo: '{{count}} daq oldin',
    hoursAgo: '{{count}} soat oldin',
    daysAgo: '{{count}} kun oldin',
    today: 'Bugun',
    yesterday: 'Kecha',
  },

  // Trends & Statistics
  trends: {
    up: "O'sish",
    down: 'Tushish',
    stable: 'Barqaror',
    vsLastPeriod: "o'tgan davrga nisbatan",
    change: "O'zgarish",
    growth: "O'sish",
    decline: 'Pasayish',
  },

  // Currency & Numbers
  format: {
    currency: '{{value}}',
    percentage: '{{value}}%',
    items: '{{count}} ta mahsulot',
    sold: '{{count}} ta sotildi',
  },

  // Errors
  errors: {
    generic: "Nimadir noto'g'ri ketdi",
    network: "Tarmoq xatosi. Ulanishni tekshiring.",
    timeout: "So'rov vaqti tugadi. Qaytadan urining.",
    unauthorized: 'Sessiya tugadi. Qaytadan kiring.',
    notFound: 'Resurs topilmadi',
    serverError: 'Server xatosi. Keyinroq urining.',
  },

  // Card Titles
  cards: {
    financialSummary: 'Moliyaviy xulosa',
    orderStats: 'Buyurtma statistikasi',
    trendAnalysis: 'Trend tahlili',
    cogsAnalysis: 'Mahsulot tannarxi',
  },
};
