import { BaseApiClient } from "@/lib/api/BaseApiClient";
import {
  User,
  TokenIcons,
  CheckoutSessionResponse,
  CheckoutLocale
} from "@/lib/api/backend";

export class UserService extends BaseApiClient {
  /**
   * Obtener perfil del usuario autenticado
   */
  public async getUserProfile(): Promise<User | null> {
    const response = await fetch(`${this.baseUrl}/api/users/profile`, {
      method: 'GET',
      headers: this.createHeaders(true),
    });

    try {
      return await this.parseResponse<User>(response);
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  /**
   * Obtener todos los usuarios del sistema (Legacy generic request)
   */
  public async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/api/users`, {
      method: 'GET',
      headers: this.createHeaders(true),
    });

    return this.parseResponse<User[]>(response);
  }

  /**
   * Obtener usuario por ID
   */
  public async getUserById(id: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/users/${id}`, {
      method: 'GET',
      headers: this.createHeaders(true),
    });

    return this.parseResponse<User>(response);
  }

  /**
   * Actualizar mi propio perfil
   */
  public async updateMyProfile(updates: { username?: string; email?: string }): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/users/profile`, {
      method: 'PUT',
      headers: this.createHeaders(true),
      body: JSON.stringify(updates),
    });

    return this.parseResponse<User>(response);
  }

  /**
   * Cambiar contraseña autenticada
   */
  public async changePassword(
    currentPass: string,
    newPass: string,
    confirmPass: string
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/users/change-password`, {
      method: 'POST',
      headers: this.createHeaders(true),
      body: JSON.stringify({
        currentPassword: currentPass,
        newPassword: newPass,
        confirmPassword: confirmPass,
      }),
    });

    await this.parseResponse<void>(response);
  }

  /**
   * Obtener token de iconos activo del usuario
   */
  public async getUserToken(): Promise<TokenIcons | null> {
    const response = await fetch(`${this.baseUrl}/api/tokens/me`, {
      method: 'GET',
      headers: this.createHeaders(true),
    });

    try {
      return await this.parseResponse<TokenIcons>(response);
    } catch (e) {
      return null;
    }
  }

  /**
   * Historial de tokens del usuario
   */
  public async getAllTokens(): Promise<TokenIcons[]> {
    const response = await fetch(`${this.baseUrl}/api/tokens`, {
      method: 'GET',
      headers: this.createHeaders(true),
    });

    return this.parseResponse<TokenIcons[]>(response);
  }

  /**
   * Iniciar flujo de suscripción creando sesión Checkout
   */
  public async createCheckoutSession(
    planType: string,
    locale: CheckoutLocale = 'es'
  ): Promise<CheckoutSessionResponse> {
    const response = await fetch(`${this.baseUrl}/api/stripe/checkout`, {
      method: 'POST',
      headers: this.createHeaders(true),
      body: JSON.stringify({ planType, locale }),
    });

    return this.parseResponse<CheckoutSessionResponse>(response);
  }

  /**
   * Validación rápida de nivel de acceso premium
   */
  public async hasPremiumAccess(): Promise<boolean> {
    try {
      const user = await this.getUserProfile();
      if (!user) return false;
      
      // Validaciones de acceso premium según el rol o vigencia del token
      if (user.role_name === 'admin' || user.role_name === 'pro') {
        return true;
      }

      if (!user.token_finish_date) {
        return false;
      }

      const now = new Date();
      const expiry = new Date(user.token_finish_date);
      
      return expiry > now;
    } catch (error) {
      console.error("Error comprobando premium access:", error);
      return false;
    }
  }
}
