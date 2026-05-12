export interface AdminApiPagination {
  page: number;
  pageSize: number;
  limit?: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type AdminRole = 'admin' | 'user' | 'pro';
export type AdminSubscriptionStatus = 'active' | 'expiring' | 'expired' | 'none';
export type AdminAccountStatus = 'active' | 'disabled';
export type AdminSortBy = 'id' | 'created_at' | 'username' | 'email' | 'role_name' | 'token_finish_date';
export type AdminSortDir = 'asc' | 'desc';
export type AdminPlanType = 'pro' | 'enterprise';
export type AdminMetricsGranularity = 'day' | 'month' | 'year' | 'custom';

export interface GetAdminUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: AdminRole;
  subscriptionStatus?: AdminSubscriptionStatus;
  accountStatus?: AdminAccountStatus;
  sortBy?: AdminSortBy;
  sortDir?: AdminSortDir;
  expiringInDays?: number;
}

export interface UpdateAdminUserPayload {
  username?: string;
  email?: string;
  roles_id?: number;
  role?: AdminRole;
}

export interface GetAdminSubscriptionsParams {
  page?: number;
  pageSize?: number;
  status?: Exclude<AdminSubscriptionStatus, 'none'>;
  planType?: AdminPlanType;
  expiringInDays?: number;
  from?: string;
  to?: string;
}

export interface GetAdminMetricsParams {
  granularity?: AdminMetricsGranularity;
  from?: string;
  to?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  roles_id: number;
  role_name: AdminRole;
  token_id: string | null;
  token_finish_date: string | null;
  subscriptionStatus: AdminSubscriptionStatus;
  accountStatus: AdminAccountStatus;
  disabled_at: string | null;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUsersFiltersApplied {
  search: string | null;
  role: AdminRole | null;
  subscriptionStatus: AdminSubscriptionStatus | null;
  accountStatus: AdminAccountStatus | null;
  sortBy: AdminSortBy;
  sortDir: AdminSortDir;
  expiringInDays: number;
}

export interface AdminUsersResult<T = AdminUser> {
  data: T[];
  pagination: AdminApiPagination;
  filtersApplied: AdminUsersFiltersApplied;
  generatedAt: string;
}

export interface AdminSubscription {
  user_id: string;
  user_email: string;
  username: string;
  token_id: string;
  plan_type: AdminPlanType;
  start_date: string;
  finish_date: string;
  subscriptionStatus: Exclude<AdminSubscriptionStatus, 'none'>;
}

export interface AdminSubscriptionsSummaryCounts {
  active: number;
  expiring: number;
  expired: number;
  total: number;
}

export interface AdminSubscriptionsFiltersApplied {
  status: Exclude<AdminSubscriptionStatus, 'none'> | null;
  planType: AdminPlanType | null;
  expiringInDays: number;
  from: string | null;
  to: string | null;
}

export interface AdminSubscriptionsResult {
  data: AdminSubscription[];
  summaryCounts: AdminSubscriptionsSummaryCounts;
  pagination: AdminApiPagination;
  filtersApplied: AdminSubscriptionsFiltersApplied;
  generatedAt: string;
}

export interface AdminMetricsKpis {
  registrations: number;
  salesCount: number;
  grossRevenue: number;
  netRevenue: number;
}

export interface AdminMetricsTimeseriesPoint {
  bucketKey: string;
  bucketStart: string;
  bucketEnd: string;
  registrations: number;
  salesCount: number;
  grossRevenue: number;
  netRevenue: number;
}

export interface AdminMetricsFiltersApplied {
  granularity: AdminMetricsGranularity;
  from: string;
  to: string;
  bucketGranularity: Exclude<AdminMetricsGranularity, 'custom'>;
}

export interface AdminMetricsResult {
  data: {
    kpis: AdminMetricsKpis;
    timeseries: AdminMetricsTimeseriesPoint[];
  };
  filtersApplied: AdminMetricsFiltersApplied;
  generatedAt: string;
}

export type AdminPreferenceColumnKey =
  | 'username'
  | 'email'
  | 'role'
  | 'accountStatus'
  | 'status'
  | 'plan'
  | 'startDate'
  | 'tokenExpiry';

export interface AdminPreferencesData {
  columnVisibility: Record<AdminPreferenceColumnKey, boolean>;
  columnOrder: AdminPreferenceColumnKey[];
}

export interface AdminPreferencesResult {
  data: AdminPreferencesData;
  generatedAt: string;
}

export interface UpdateAdminPreferencesPayload {
  columnVisibility?: Partial<Record<AdminPreferenceColumnKey, boolean>>;
  columnOrder?: AdminPreferenceColumnKey[];
}
