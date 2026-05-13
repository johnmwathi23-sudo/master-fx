export interface IUser {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isEmailVerified: boolean;
  isActive: boolean;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IWallet {
  id: string;
  userId: string;
  balance: number;
  demoBalance: number;
  availableBalance: number;
  lockedBalance: number;
  totalProfit: number;
  totalLoss: number;
  currency: string;
}

export interface ITrade {
  id: string;
  userId: string;
  assetId: string;
  type: 'BUY' | 'SELL';
  status: 'PENDING' | 'OPEN' | 'CLOSED' | 'CANCELLED' | 'EXPIRED';
  amount: number;
  entryPrice: number;
  exitPrice: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  profitLoss: number | null;
  commission: number;
  duration: number | null;
  isDemo: boolean;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  asset?: IAsset;
}

export interface IAsset {
  id: string;
  symbol: string;
  name: string;
  category: 'FOREX' | 'CRYPTO' | 'COMMODITIES' | 'STOCKS' | 'INDICES';
  currentPrice: number;
  previousPrice: number;
  dailyChange: number;
  dailyHigh: number;
  dailyLow: number;
  volume: number;
  isActive: boolean;
  precision: number;
}

export interface ITransaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRADE_PROFIT' | 'TRADE_LOSS' | 'REFERRAL_BONUS' | 'BONUS' | 'FEE';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  amount: number;
  fee: number;
  balance: number;
  description: string | null;
  reference: string | null;
  createdAt: string;
}

export interface INotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export interface IReferral {
  id: string;
  referrerId: string;
  refereeId: string;
  bonusAmount: number;
  isBonusPaid: boolean;
  code: string;
  createdAt: string;
}

export interface IKYCSubmission {
  id: string;
  userId: string;
  status: 'PENDING' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  documentType: string;
  country: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}

export interface IAIMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  tokens: number;
  createdAt: string;
}

export interface IMarketData {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
}

export interface IPlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalTrades: number;
  totalVolume: number;
  totalRevenue: number;
  date: string;
}

export type ThemeMode = 'dark' | 'light';

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface ITradeRequest {
  assetId: string;
  type: 'BUY' | 'SELL';
  amount: number;
  stopLoss?: number;
  takeProfit?: number;
  duration?: number;
  isDemo?: boolean;
}

export interface IDepositRequest {
  amount: number;
  paymentMethod: string;
}

export interface IWithdrawRequest {
  amount: number;
  walletAddress: string;
}

export interface IAIChatRequest {
  message: string;
  context?: string;
}

export interface IApiError {
  statusCode: number;
  message: string;
  error: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IDashboardStats {
  totalBalance: number;
  totalProfit: number;
  totalLoss: number;
  winRate: number;
  totalTrades: number;
  activeTrades: number;
  todayPnL: number;
  portfolioChange: number;
}
