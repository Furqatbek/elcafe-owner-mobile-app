// ============== Dashboard Types ==============

export type TrendDirection = 'UP' | 'DOWN' | 'STABLE';
export type AlertLevel = 'CRITICAL' | 'LOW' | 'REORDER';
export type OrderType = 'DINE_IN' | 'DELIVERY' | 'TAKEAWAY';
export type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE';

export interface SoldItem {
  productName: string;
  quantitySold: number;
  totalRevenue: number;
  profitMargin: number;
}

export interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  totalItemsSold: number;
}

export interface DashboardComparison {
  incomeChange: number;
  expenseChange: number;
  profitChange: number;
  orderCountChange: number;
  trend: TrendDirection;
}

export interface InventoryAlerts {
  lowStockCount: number;
  reorderCount: number;
}

export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  orderStats: OrderStats;
  incomeByOrderType: Record<OrderType, number>;
  incomeByPaymentMethod: Record<PaymentMethod, number>;
  comparison: DashboardComparison;
  inventoryAlerts: InventoryAlerts;
  soldItems: SoldItem[];
}

// ============== Analytics Types ==============

export interface DailyRevenue {
  date: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  cashRevenue: number;
  cardRevenue: number;
  onlineRevenue: number;
}

export interface COGSData {
  totalCOGS: number;
  totalRevenue: number;
  foodCostPercentage: number;
  grossProfitMargin: number;
  grossProfit: number;
}

export interface PeakHour {
  hour: number;
  orderCount: number;
  revenue: number;
}

export interface PeakHoursData {
  peakHours: PeakHour[];
  peakStartHour: number;
  peakEndHour: number;
}

export interface CategorySales {
  categoryName: string;
  totalRevenue: number;
  totalItemsSold: number;
  percentageOfTotalRevenue: number;
}

// ============== Inventory Types ==============

export interface LowStockItem {
  ingredientName: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  alertLevel: AlertLevel;
}

export interface StockSummary {
  lowStockItems: LowStockItem[];
  lowStockCount: number;
  reorderCount: number;
  criticalCount: number;
}

export interface InventoryTurnover {
  turnoverRatio: number;
  daysToSellInventory: number;
  averageInventoryValue: number;
}

// ============== Reports Types ==============

export interface ProfitLossReport {
  salesRevenue: number;
  serviceFeeRevenue: number;
  deliveryFeeRevenue: number;
  tipRevenue: number;
  totalRevenue: number;
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  netIncome: number;
  orderCount: number;
}

export interface COGSReport {
  totalCOGS: number;
  totalRevenue: number;
  foodCostPercentage: number;
  grossProfit: number;
  grossProfitMargin: number;
}

export interface CustomerRetention {
  retentionRate: number;
  churnRate: number;
  repeatCustomerRate: number;
  newCustomers: number;
  returningCustomers: number;
}

export interface CustomerLTV {
  averageLTV: number;
  averageOrderValue: number;
  averageOrdersPerCustomer: number;
}

// ============== Notifications Types ==============

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: number;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  content: Notification[];
  totalElements: number;
}

export interface UnreadCountResponse {
  count: number;
}

// ============== Auth Types ==============

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  restaurantId: number;
  active: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
  timestamp: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  restaurantId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============== Common Types ==============

export interface DateRange {
  startDate: string;
  endDate: string;
}

export type PeriodType = 'today' | 'week' | 'month';

export interface ApiError {
  message: string;
  status: number;
}
