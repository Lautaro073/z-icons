/**
 * Backend API Client
 * Comunicación con el backend Express usando JWT Authentication
 * [REFACTOR]: Ahora actúa como FACADE delegando en Servicios POO
 */

import { BaseApiClient } from "./BaseApiClient";
import { authService, userService, adminService, iconService } from "./services";
import { UserEntity } from "@/features/user/models/UserEntity";
import { IconEntity } from "@/features/icons-explorer/models/IconEntity";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// ==================== INTERFACES ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  requires2FA?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles_id: number;
  role_name: 'admin' | 'user' | 'pro';
  token_id: string | null;
  token_finish_date?: string | null;
  settings_icons_id: string | null;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TokenIcons {
  id: string;
  token: string;
  type: string;
  start_date: string;
  finish_date: string;
  created_at: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
}

export interface RefreshTokenResponse {
  refreshToken: string;
  expiresAt: string;
}

export interface RefreshAccessTokenResponse {
  accessToken: string;
  user: User;
}

export interface PasswordResetOtpVerifyResponse {
  valid: boolean;
  expiresAt: string;
}

export interface CheckoutSessionResponse {
  url: string;
}

export type CheckoutLocale = 'es' | 'en';
export type OtpLocale = 'es' | 'en';

import { 
  AdminApiPagination as AdminPagination,
  AdminRole,
  AdminSubscriptionStatus,
  AdminAccountStatus,
  AdminSortBy,
  AdminSortDir,
  AdminPlanType,
  AdminMetricsGranularity,
  GetAdminUsersParams,
  UpdateAdminUserPayload,
  GetAdminSubscriptionsParams,
  GetAdminMetricsParams,
  AdminUser,
  AdminUsersFiltersApplied,
  AdminUsersResult,
  AdminSubscription,
  AdminSubscriptionsSummaryCounts,
  AdminSubscriptionsFiltersApplied,
  AdminSubscriptionsResult,
  AdminMetricsKpis,
  AdminMetricsTimeseriesPoint,
  AdminMetricsFiltersApplied,
  AdminMetricsResult,
  AdminPreferenceColumnKey,
  AdminPreferencesData,
  AdminPreferencesResult,
  UpdateAdminPreferencesPayload
} from "@/types/admin";

export type { 
  AdminPagination,
  AdminRole,
  AdminSubscriptionStatus,
  AdminAccountStatus,
  AdminSortBy,
  AdminSortDir,
  AdminPlanType,
  AdminMetricsGranularity,
  GetAdminUsersParams,
  UpdateAdminUserPayload,
  GetAdminSubscriptionsParams,
  GetAdminMetricsParams,
  AdminUser,
  AdminUsersFiltersApplied,
  AdminUsersResult,
  AdminSubscription,
  AdminSubscriptionsSummaryCounts,
  AdminSubscriptionsFiltersApplied,
  AdminSubscriptionsResult,
  AdminMetricsKpis,
  AdminMetricsTimeseriesPoint,
  AdminMetricsFiltersApplied,
  AdminMetricsResult,
  AdminPreferenceColumnKey,
  AdminPreferencesData,
  AdminPreferencesResult,
  UpdateAdminPreferencesPayload
};

interface AdminApiEnvelope<TData, TFilters> extends ApiResponse<TData> {
  pagination?: AdminPagination;
  filtersApplied?: TFilters;
  generatedAt?: string;
  summaryCounts?: AdminSubscriptionsSummaryCounts;
  invalidParam?: string;
  expected?: string;
  received?: string;
}

export class BackendApiError extends Error {
  status: number;
  invalidParam?: string;
  expected?: string;
  received?: string;

  constructor(
    message: string,
    status: number,
    details?: {
      invalidParam?: string;
      expected?: string;
      received?: string;
    }
  ) {
    super(message);
    this.name = 'BackendApiError';
    this.status = status;
    this.invalidParam = details?.invalidParam;
    this.expected = details?.expected;
    this.received = details?.received;
  }
}

export function isBackendApiError(error: unknown): error is BackendApiError {
  return error instanceof BackendApiError;
}

export interface SettingsIcons {
  id: string;
  icon: string;
  layer: string | null;
  created_at?: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  manualEntry: string;
}

export interface TwoFactorVerifyResponse {
  backupCodes: string[];
}

// ==================== CUSTOM ICONS INTERFACES ====================

export interface CustomIcon {
  id: string;
  name: string;
  category: string;
  status: string;
  svg_content?: string;
  is_premium?: boolean | number;
  created_at: string;
  created_by?: string;
  create_by?: string;
}

export interface CustomIconPayload {
  name: string;
  category: string;
  svg_content: string;
  status?: string;
  is_premium?: boolean;
}

// ==================== TOKEN MANAGEMENT (RETAINED FOR AUTH CONTEXT) ====================

let currentAccessToken: string | null = null;

const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
const REFRESH_TOKEN_EXPIRY_STORAGE_KEY = 'refreshTokenExpiry';
const USER_ROLE_STORAGE_KEY = 'userRole';
const USER_ROLE_COOKIE_KEY = 'userRole';
const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

type UserRoleHint = 'admin' | 'user' | 'pro';

function normalizeUserRole(role: string | null | undefined): UserRoleHint | null {
  if (role === 'admin' || role === 'user' || role === 'pro') {
    return role;
  }
  return null;
}

function isBrowserEnvironment(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const target = `${name}=`;
  const cookieChunk = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(target));

  if (!cookieChunk) return null;

  const rawValue = cookieChunk.slice(target.length);

  try {
    return decodeURIComponent(rawValue);
  } catch {
    return rawValue;
  }
}

function setCookieValue(name: string, value: string, expiresAt?: string): void {
  if (!isBrowserEnvironment()) return;

  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  const encodedValue = encodeURIComponent(value);
  const parsedExpiry = expiresAt ? new Date(expiresAt) : null;
  const hasValidExpiry = Boolean(parsedExpiry && !Number.isNaN(parsedExpiry.getTime()));
  const expiryDirective = hasValidExpiry
    ? `; Expires=${parsedExpiry!.toUTCString()}`
    : `; Max-Age=${REFRESH_TOKEN_MAX_AGE_SECONDS}`;

  document.cookie = `${name}=${encodedValue}; Path=/; SameSite=Lax${expiryDirective}${secureFlag}`;
}

function removeCookieValue(name: string): void {
  if (!isBrowserEnvironment()) return;

  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secureFlag}`;
}

export function setRefreshToken(refreshToken: string, expiresAt?: string | null): void {
  if (!isBrowserEnvironment()) return;

  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  setCookieValue(REFRESH_TOKEN_STORAGE_KEY, refreshToken, expiresAt ?? undefined);

  if (expiresAt) {
    localStorage.setItem(REFRESH_TOKEN_EXPIRY_STORAGE_KEY, expiresAt);
    setCookieValue(REFRESH_TOKEN_EXPIRY_STORAGE_KEY, expiresAt, expiresAt);
    return;
  }

  localStorage.removeItem(REFRESH_TOKEN_EXPIRY_STORAGE_KEY);
  removeCookieValue(REFRESH_TOKEN_EXPIRY_STORAGE_KEY);
}

export function setUserRoleHint(role: string | null | undefined): void {
  if (!isBrowserEnvironment()) return;

  const normalized = normalizeUserRole(role);

  if (!normalized) {
    localStorage.removeItem(USER_ROLE_STORAGE_KEY);
    removeCookieValue(USER_ROLE_COOKIE_KEY);
    return;
  }

  localStorage.setItem(USER_ROLE_STORAGE_KEY, normalized);
  setCookieValue(USER_ROLE_COOKIE_KEY, normalized);
}

export function setCurrentAccessToken(token: string | null) {
  currentAccessToken = token;
  BaseApiClient.setAccessToken(token); // Sync con los servicios POO
}

export function getAccessToken(): string | null {
  return BaseApiClient.getAccessToken();
}

export function getRefreshToken(): string | null {
  if (!isBrowserEnvironment()) return null;

  const tokenFromStorage = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  const tokenFromCookie = getCookieValue(REFRESH_TOKEN_STORAGE_KEY);

  if (tokenFromStorage && !tokenFromCookie) {
    const expiry = localStorage.getItem(REFRESH_TOKEN_EXPIRY_STORAGE_KEY);
    setCookieValue(REFRESH_TOKEN_STORAGE_KEY, tokenFromStorage, expiry ?? undefined);
    if (expiry) {
      setCookieValue(REFRESH_TOKEN_EXPIRY_STORAGE_KEY, expiry, expiry);
    }
    return tokenFromStorage;
  }

  if (!tokenFromStorage && tokenFromCookie) {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokenFromCookie);
    const expiryFromCookie = getCookieValue(REFRESH_TOKEN_EXPIRY_STORAGE_KEY);
    if (expiryFromCookie) {
      localStorage.setItem(REFRESH_TOKEN_EXPIRY_STORAGE_KEY, expiryFromCookie);
    }
    return tokenFromCookie;
  }

  return tokenFromStorage ?? tokenFromCookie ?? null;
}

export function clearTokens() {
  currentAccessToken = null;
  BaseApiClient.setAccessToken(null); // Sync con los servicios POO
  if (isBrowserEnvironment()) {
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_EXPIRY_STORAGE_KEY);
    localStorage.removeItem(USER_ROLE_STORAGE_KEY);
    removeCookieValue(REFRESH_TOKEN_STORAGE_KEY);
    removeCookieValue(REFRESH_TOKEN_EXPIRY_STORAGE_KEY);
    removeCookieValue(USER_ROLE_COOKIE_KEY);
  }
}

// ==========================================================================
// ======= NUEVA ARQUITECTURA: FACADE PATTERN (RE-EXPORTS) ==================
// ==========================================================================

/**
 * Registra un nuevo usuario delegando en AuthService.
 */
export async function register(
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<RegisterResponse> {
  return authService.register(username, email, password, confirmPassword);
}

/**
 * Inicia sesión delegando en AuthService.
 */
export async function login(
  email: string,
  password: string,
  twoFactorCode?: string
): Promise<LoginResponse> {
  return authService.login(email, password, twoFactorCode);
}

/**
 * Envío de OTP vía correo.
 */
export async function requestPasswordResetOtp(email: string, locale: OtpLocale): Promise<void> {
  return authService.requestPasswordResetOtp(email, locale);
}

/**
 * Verificación de código OTP.
 */
export async function verifyPasswordResetOtp(
  email: string,
  otp: string,
  locale: OtpLocale
): Promise<PasswordResetOtpVerifyResponse> {
  return authService.verifyPasswordResetOtp(email, otp, locale);
}

/**
 * Ejecuta el cambio de contraseña con OTP.
 */
export async function resetPasswordWithOtp(
  email: string,
  otp: string,
  newPassword: string,
  confirmPassword: string,
  locale: OtpLocale
): Promise<void> {
  return authService.resetPasswordWithOtp(email, otp, newPassword, confirmPassword, locale);
}

/**
 * Recupera el refresh token del backend.
 */
export async function getRefreshTokenFromServer(): Promise<RefreshTokenResponse> {
  return authService.getRefreshTokenFromServer();
}

/**
 * Realiza el intercambio de refresh tokens.
 */
export async function refreshAccessToken(): Promise<RefreshAccessTokenResponse> {
  const token = getRefreshToken();
  if (!token) throw new Error('No stored refresh token available');
  return authService.refreshAccessToken(token);
}

/**
 * Obtiene el perfil del usuario autenticado.
 */
export async function getUserProfile(): Promise<User | null> {
  return userService.getUserProfile();
}

/**
 * Dispara el cierre de sesión y limpia memoria local.
 */
export async function logout(): Promise<void> {
  try {
    await authService.logout();
  } finally {
    clearTokens();
  }
}

// ==================== USUARIOS FACADE ====================

export async function getAllUsers(): Promise<User[]> {
  return userService.getAllUsers();
}

export async function getUserById(id: string): Promise<User> {
  return userService.getUserById(id);
}

export async function updateMyProfile(updates: { username?: string; email?: string }): Promise<User> {
  return userService.updateMyProfile(updates);
}

export async function changePassword(
  userId: string, // Se mantiene por retrocompatibilidad aunque no se use en el body interno del endpoint actual
  currentPassword: string,
  newPassword: string
): Promise<void> {
  return userService.changePassword(currentPassword, newPassword, newPassword); // Adaptando a la firma de UserService
}

// ==================== ADMIN FACADE ====================

export async function getAdminUsers(
  params: GetAdminUsersParams = {}
): Promise<AdminUsersResult<UserEntity>> {
  return adminService.getAdminUsers(params);
}

export async function updateAdminUser(
  userId: string,
  payload: UpdateAdminUserPayload
): Promise<AdminUser> {
  return adminService.updateAdminUser(userId, payload);
}

export async function disableAdminUser(userId: string): Promise<AdminUser> {
  return adminService.disableAdminUser(userId);
}

export async function reEnableAdminUser(userId: string): Promise<AdminUser> {
  return adminService.reEnableAdminUser(userId);
}

export async function deleteAdminUserPermanently(userId: string): Promise<void> {
  return adminService.deleteAdminUserPermanently(userId);
}

export async function getAdminSubscriptions(
  params: GetAdminSubscriptionsParams = {}
): Promise<AdminSubscriptionsResult> {
  return adminService.getAdminSubscriptions(params);
}

export async function getAdminMetrics(
  params: GetAdminMetricsParams = {}
): Promise<AdminMetricsResult> {
  return adminService.getAdminMetrics(params);
}

export async function getAdminPreferences(): Promise<AdminPreferencesResult> {
  return adminService.getAdminPreferences();
}

export async function updateAdminPreferences(
  payload: UpdateAdminPreferencesPayload
): Promise<AdminPreferencesResult> {
  return adminService.updateAdminPreferences(payload);
}

// ==================== TOKENS FACADE ====================

export async function getUserToken(): Promise<TokenIcons | null> {
  return userService.getUserToken();
}

export async function getAllTokens(): Promise<TokenIcons[]> {
  return userService.getAllTokens();
}

// ==================== STRIPE FACADE ====================

export async function createCheckoutSession(
  planType: 'pro' | 'enterprise',
  locale: CheckoutLocale
): Promise<CheckoutSessionResponse> {
  return userService.createCheckoutSession(planType, locale);
}

// ==================== SETTINGS ICONS FACADE ====================

export async function getMyIconSettings(): Promise<SettingsIcons | null> {
  return iconService.getMyIconSettings();
}

export async function updateIconSettings(
  icon: string,
  layer?: string
): Promise<SettingsIcons> {
  return iconService.updateIconSettings({ icon, layer });
}

// ==================== 2FA FACADE ====================

export async function setup2FA(): Promise<TwoFactorSetup> {
  return authService.setup2FA();
}

export async function verify2FA(token: string): Promise<TwoFactorVerifyResponse> {
  return authService.verify2FA(token);
}

export async function disable2FA(password: string, twoFactorCode: string): Promise<void> {
  return authService.disable2FA(password, twoFactorCode);
}

// ==================== UTILIDADES FACADE ====================

export async function hasPremiumAccess(): Promise<boolean> {
  return userService.hasPremiumAccess();
}

export function isTokenExpired(): boolean {
  const token = getAccessToken();
  if (!token) return true;

  try {
    const part = token.split('.')[1];
    if (!part) return true;
    const payload = JSON.parse(atob(part));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// ==================== CUSTOM ICONS FACADE ====================

export async function getCustomIcons(): Promise<IconEntity[]> {
  return iconService.getCustomIcons();
}

export async function createCustomIcon(payload: CustomIconPayload): Promise<CustomIcon> {
  return iconService.createCustomIcon(payload);
}

export async function createCustomIconsBulk(payloadArray: CustomIconPayload[]): Promise<CustomIcon[]> {
  return iconService.createCustomIconsBulk(payloadArray);
}

export async function updateCustomIcon(id: string, payload: Partial<CustomIconPayload>): Promise<CustomIcon> {
  return iconService.updateCustomIcon(id, payload);
}

export async function deleteCustomIcon(id: string): Promise<void> {
  return iconService.deleteCustomIcon(id);
}
