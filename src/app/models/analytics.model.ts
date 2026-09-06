export type AnalyticsEntity = 'USER' | 'PRODUCT' | 'ORDER';

export type AnalyticsAction =
  | 'REGISTER' | 'REGISTER_FAILED' | 'REGISTER_ADMIN' | 'REGISTER_ADMIN_FAILED'
  | 'LOGIN' | 'LOGIN_FAILED'
  | 'UPDATE' | 'UPDATE_USER_IMAGE' | 'UPDATE_USER_IMAGE_FAILED' | 'UPDATE_FAILED'
  | 'DELETE' | 'DELETE_FAILED'
  | 'ORDER_CREATED' | 'ORDER_PAID' | 'ORDER_CANCELLED'
  | 'SALE';

export interface EventCount {
  totalEvents: number;
}

export interface EntityAnalytics {
  total: number;
  entities: Record<AnalyticsEntity, number>;
}

export interface TimeSeriesPoint {
  date: string;
  count: number;
}

export interface TopEntity {
  entityId: number;
  category: string | null;
  brand: string | null;
  totalCount: number;
  totalValue: number;
}

export interface CategoryRevenue {
  category: string;
  totalRevenue: number;
}

export interface LoginStats {
  successCount: number;
  failureCount: number;
  totalAttempts: number;
  successRate: number;
}
