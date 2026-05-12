import type {
  ApiResponse,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  RefreshAccessTokenResponse,
  PasswordResetOtpVerifyResponse,
  User,
} from "@/lib/api/backend";
import { clearTokens, getAccessToken, getRefreshToken } from "@/lib/api/backend";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

type OtpLocale = "es" | "en";

function createAuthHeaders(includeAuth = true): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  return headers;
}

export async function register(
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<RegisterResponse> {
  const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: "POST",
    headers: createAuthHeaders(false),
    body: JSON.stringify({ username, email, password, confirmPassword }),
  });

  const data: ApiResponse<RegisterResponse> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Registration failed");
  }

  return data.data!;
}

export async function login(
  email: string,
  password: string,
  twoFactorCode?: string
): Promise<LoginResponse> {
  const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: createAuthHeaders(false),
    body: JSON.stringify({ email, password, twoFactorCode }),
  });

  const data: ApiResponse<LoginResponse> = await response.json();

  if (data.requires2FA) {
    throw new Error("2FA_REQUIRED");
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Login failed");
  }

  return data.data!;
}

export async function requestPasswordResetOtp(email: string, locale: OtpLocale): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/api/auth/password-reset/request-otp`, {
    method: "POST",
    headers: {
      ...createAuthHeaders(false),
      "Accept-Language": locale,
      "X-Locale": locale,
    },
    body: JSON.stringify({ email, locale }),
  });

  const data: ApiResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to request password reset OTP");
  }
}

export async function verifyPasswordResetOtp(
  email: string,
  otp: string,
  locale: OtpLocale
): Promise<PasswordResetOtpVerifyResponse> {
  const response = await fetch(`${BACKEND_URL}/api/auth/password-reset/verify-otp`, {
    method: "POST",
    headers: {
      ...createAuthHeaders(false),
      "Accept-Language": locale,
      "X-Locale": locale,
    },
    body: JSON.stringify({ email, otp, locale }),
  });

  const data: ApiResponse<PasswordResetOtpVerifyResponse> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to verify OTP");
  }

  return data.data!;
}

export async function resetPasswordWithOtp(
  email: string,
  otp: string,
  newPassword: string,
  confirmPassword: string,
  locale: OtpLocale
): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/api/auth/password-reset/reset-with-otp`, {
    method: "POST",
    headers: {
      ...createAuthHeaders(false),
      "Accept-Language": locale,
      "X-Locale": locale,
    },
    body: JSON.stringify({ email, otp, newPassword, confirmPassword, locale }),
  });

  const data: ApiResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to reset password");
  }
}

export async function getRefreshTokenFromServer(): Promise<RefreshTokenResponse> {
  const response = await fetch(`${BACKEND_URL}/api/auth/refresh-token`, {
    method: "POST",
    headers: createAuthHeaders(),
  });

  const data: ApiResponse<RefreshTokenResponse> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to get refresh token");
  }

  return data.data!;
}

export async function refreshAccessToken(): Promise<RefreshAccessTokenResponse> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: "POST",
    headers: createAuthHeaders(false),
    body: JSON.stringify({ refreshToken }),
  });

  const data: ApiResponse<RefreshAccessTokenResponse> = await response.json();

  if (!response.ok || !data.success) {
    clearTokens();
    throw new Error(data.message || "Failed to refresh token");
  }

  return data.data!;
}

export async function getUserProfile(): Promise<User | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
      headers: createAuthHeaders(),
    });

    if (!response.ok) return null;

    const data: ApiResponse<User> = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      headers: createAuthHeaders(),
    });
  } finally {
    clearTokens();
  }
}
