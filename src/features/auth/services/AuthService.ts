import { BaseApiClient } from "@/lib/api/BaseApiClient";
import {
  RegisterResponse,
  LoginResponse,
  OtpLocale,
  PasswordResetOtpVerifyResponse,
  RefreshTokenResponse,
  RefreshAccessTokenResponse,
  TwoFactorSetup,
  TwoFactorVerifyResponse,
  ApiResponse
} from "@/lib/api/backend";

export class AuthService extends BaseApiClient {
  
  /**
   * Registrar nuevo usuario
   */
  public async register(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<RegisterResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: this.createHeaders(false),
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });

    // Utilizamos parsing directo porque necesitamos acceder al envelope para ver data!
    const data: ApiResponse<RegisterResponse> = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Registration failed');
    }

    return data.data!;
  }

  /**
   * Iniciar sesión
   */
  public async login(
    email: string,
    password: string,
    twoFactorCode?: string
  ): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: this.createHeaders(false),
      body: JSON.stringify({ email, password, twoFactorCode }),
    });

    const data: ApiResponse<LoginResponse> = await response.json();

    // Si requiere 2FA, el backend original lo trata como excepción de flujo
    if (data.requires2FA) {
      throw new Error('2FA_REQUIRED');
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }

    return data.data!;
  }

  /**
   * Solicitar OTP para reset de contraseña
   */
  public async requestPasswordResetOtp(email: string, locale: OtpLocale): Promise<void> {
    const localeHeaders = {
      ...this.createHeaders(false),
      'Accept-Language': locale,
      'X-Locale': locale,
    };

    const response = await fetch(`${this.baseUrl}/api/auth/password-reset/request-otp`, {
      method: 'POST',
      headers: localeHeaders,
      body: JSON.stringify({ email, locale }),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to request password reset OTP');
    }
  }

  /**
   * Verificar OTP de reset de contraseña
   */
  public async verifyPasswordResetOtp(
    email: string,
    otp: string,
    locale: OtpLocale
  ): Promise<PasswordResetOtpVerifyResponse> {
    const localeHeaders = {
      ...this.createHeaders(false),
      'Accept-Language': locale,
      'X-Locale': locale,
    };

    const response = await fetch(`${this.baseUrl}/api/auth/password-reset/verify-otp`, {
      method: 'POST',
      headers: localeHeaders,
      body: JSON.stringify({ email, otp, locale }),
    });

    const data: ApiResponse<PasswordResetOtpVerifyResponse> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Invalid or expired OTP');
    }

    return data.data!;
  }

  /**
   * Reestablecer contraseña con token OTP
   */
  public async resetPasswordWithOtp(
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string,
    locale: OtpLocale
  ): Promise<void> {
    const localeHeaders = {
      ...this.createHeaders(false),
      'Accept-Language': locale,
      'X-Locale': locale,
    };

    const response = await fetch(`${this.baseUrl}/api/auth/password-reset/reset`, {
      method: 'POST',
      headers: localeHeaders,
      body: JSON.stringify({ email, otp, newPassword, confirmPassword, locale }),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to reset password');
    }
  }

  /**
   * Obtener refresh token (generalmente se usa via HTTP-Only Cookies si está configurado)
   */
  public async getRefreshTokenFromServer(): Promise<RefreshTokenResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/refresh-token`, {
      method: 'POST',
      headers: this.createHeaders(false),
    });

    const data: ApiResponse<RefreshTokenResponse> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to get refresh token');
    }

    return data.data!;
  }

  /**
   * Intercambiar Refresh Token local por un nuevo Access Token
   */
  public async refreshAccessToken(storedRefreshToken: string): Promise<RefreshAccessTokenResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/refresh-access-token`, {
      method: 'POST',
      headers: this.createHeaders(false),
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
    });

    const data: ApiResponse<RefreshAccessTokenResponse> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Session expired, please log in again');
    }

    return data.data!;
  }

  /**
   * Cerrar sesión e invalidar en backend
   */
  public async logout(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: this.createHeaders(true),
      });

      if (!response.ok) {
        console.warn('Logout backend request failed, proceeding to client cleanup');
      }
    } catch (e) {
      console.error('Network error during logout:', e);
    }
  }

  /**
   * Iniciar configuración de Doble Factor
   */
  public async setup2FA(): Promise<TwoFactorSetup> {
    const response = await fetch(`${this.baseUrl}/api/auth/2fa/setup`, {
      method: 'POST',
      headers: this.createHeaders(true),
    });

    return this.parseResponse<TwoFactorSetup>(response);
  }

  /**
   * Verificar código 2FA y activar definitivamente
   */
  public async verify2FA(token: string): Promise<TwoFactorVerifyResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/2fa/verify`, {
      method: 'POST',
      headers: this.createHeaders(true),
      body: JSON.stringify({ token }),
    });

    return this.parseResponse<TwoFactorVerifyResponse>(response);
  }

  /**
   * Desactivar Doble Factor validando contraseña
   */
  public async disable2FA(password: string, twoFactorCode: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/auth/2fa/disable`, {
      method: 'POST',
      headers: this.createHeaders(true),
      body: JSON.stringify({ password, twoFactorCode }),
    });

    await this.parseResponse<void>(response);
  }
}
