export default {
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    search: 'Search',
    noData: 'No data available',
    pullToRefresh: 'Pull to refresh',
    seeAll: 'See All',
    viewAll: 'View All',
  },

  // Navigation
  navigation: {
    home: 'Home',
    analytics: 'Analytics',
    inventory: 'Inventory',
    reports: 'Reports',
    alerts: 'Alerts',
  },

  // Login Screen
  login: {
    title: 'Welcome Back',
    subtitle: 'Sign in to your restaurant dashboard',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    signIn: 'Sign In',
    signingIn: 'Signing In...',
    forgotPassword: 'Forgot Password?',
    invalidCredentials: 'Invalid email or password',
    networkError: 'Network error. Please try again.',
  },

  // Home Screen
  home: {
    greeting: 'Good {{timeOfDay}}',
    todayOverview: "Today's Overview",
    quickStats: 'Quick Stats',
    recentOrders: 'Recent Orders',
    topSelling: 'Top Selling',
    inventoryAlerts: 'Inventory Alerts',
    viewDashboard: 'View Dashboard',
    revenue: 'Revenue',
    orders: 'Orders',
    avgOrder: 'Avg Order',
    profit: 'Profit',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
  },

  // Analytics Screen
  analytics: {
    title: 'Analytics',
    subtitle: 'Business insights',
    revenueTrend: 'Revenue Trend',
    salesByCategory: 'Sales by Category',
    peakHours: 'Peak Hours',
    topSellingItems: 'Top Selling Items',
    revenueByType: 'Revenue by Type',
    total: 'Total',
    dailyAvg: 'Daily Avg',
    peakTime: 'Peak Time',
    busiestHours: 'Busiest Hours',
    dateRange: 'Date Range',
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    custom: 'Custom',
  },

  // Inventory Screen
  inventory: {
    title: 'Inventory',
    subtitle: 'Stock management',
    stockAlerts: 'Stock Alerts',
    allItems: 'All Items',
    critical: 'Critical',
    lowStock: 'Low Stock',
    reorder: 'Reorder',
    inStock: 'In Stock',
    inventoryMetrics: 'Inventory Metrics',
    turnoverRatio: 'Turnover Ratio',
    daysToSell: 'Days to Sell',
    currentStock: 'Current Stock',
    minStock: 'Min Stock',
    healthyInventory: 'Inventory levels are healthy',
    noAlerts: 'No stock alerts at this time',
  },

  // Reports Screen
  reports: {
    title: 'Reports',
    subtitle: 'Financial insights',
    profitLoss: 'Profit & Loss',
    customers: 'Customers',
    revenueBreakdown: 'Revenue Breakdown',
    expensesByCategory: 'Expenses by Category',
    netIncome: 'Net Income',
    totalRevenue: 'Total Revenue',
    totalExpenses: 'Total Expenses',
    fromOrders: 'From {{count}} orders',
    salesRevenue: 'Sales Revenue',
    serviceFees: 'Service Fees',
    deliveryFees: 'Delivery Fees',
    tips: 'Tips',
    customerRetention: 'Customer Retention',
    repeatRate: 'Repeat Rate',
    churnRate: 'Churn Rate',
    newCustomers: 'New Customers',
    returningCustomers: 'Returning',
    customerLifetimeValue: 'Customer Lifetime Value',
    averageLTV: 'Average LTV',
    avgOrderValue: 'Avg Order',
    avgOrdersPerCustomer: 'Avg Orders/Customer',
  },

  // Alerts Screen
  alerts: {
    title: 'Notifications',
    subtitle: '{{count}} notifications',
    markAllRead: 'Mark all read',
    noNotifications: 'No Notifications',
    allCaughtUp: "You're all caught up! Check back later for updates.",
    loadingNotifications: 'Loading notifications...',
    unableToLoad: 'Unable to load notifications',
    stockAlert: 'Stock Alert',
    lowStockAlert: 'Low Stock',
    financialAlert: 'Financial',
    orderAlert: 'Order',
    systemAlert: 'System',
  },

  // Settings
  settings: {
    title: 'Settings',
    language: 'Language',
    selectLanguage: 'Select Language',
    english: 'English',
    russian: 'Russian',
    uzbek: 'Uzbek',
    notifications: 'Notifications',
    pushNotifications: 'Push Notifications',
    emailNotifications: 'Email Notifications',
    account: 'Account',
    profile: 'Profile',
    security: 'Security',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to logout?',
    version: 'Version',
  },

  // Time & Date
  time: {
    justNow: 'just now',
    minutesAgo: '{{count}}m ago',
    hoursAgo: '{{count}}h ago',
    daysAgo: '{{count}}d ago',
    today: 'Today',
    yesterday: 'Yesterday',
  },

  // Trends & Statistics
  trends: {
    up: 'Up',
    down: 'Down',
    stable: 'Stable',
    vsLastPeriod: 'vs last period',
    change: 'Change',
    growth: 'Growth',
    decline: 'Decline',
  },

  // Currency & Numbers
  format: {
    currency: '{{value}}',
    percentage: '{{value}}%',
    items: '{{count}} items',
    sold: '{{count}} sold',
  },

  // Errors
  errors: {
    generic: 'Something went wrong',
    network: 'Network error. Please check your connection.',
    timeout: 'Request timed out. Please try again.',
    unauthorized: 'Session expired. Please login again.',
    notFound: 'Resource not found',
    serverError: 'Server error. Please try again later.',
  },

  // Card Titles
  cards: {
    financialSummary: 'Financial Summary',
    orderStats: 'Order Statistics',
    trendAnalysis: 'Trend Analysis',
    cogsAnalysis: 'Cost of Goods Sold',
  },
};
