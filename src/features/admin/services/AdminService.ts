import { 
  AdminUser, 
  AdminUsersFiltersApplied,
  AdminSubscription,
  AdminSubscriptionsFiltersApplied,
  AdminMetricsFiltersApplied,
  AdminPreferencesData,
  GetAdminUsersParams,
  AdminUsersResult,
  UpdateAdminUserPayload,
  GetAdminSubscriptionsParams,
  AdminSubscriptionsResult,
  GetAdminMetricsParams,
  AdminMetricsResult,
  AdminPreferencesResult,
  UpdateAdminPreferencesPayload
} from "@/types/admin";
import { BaseApiClient } from "@/lib/api/BaseApiClient";
import { UserEntity } from "@/features/user/models/UserEntity";

export class AdminService extends BaseApiClient {
  /**
   * Listado paginado y filtrado de usuarios para administradores.
   * Retorna una colección de UserEntity para encapsular la lógica de negocio.
   */
  public async getAdminUsers(
    params: GetAdminUsersParams = {}
  ): Promise<AdminUsersResult<UserEntity>> {
    const query = this.buildQueryString(params as Record<string, unknown>);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/users${query}`, {
        method: 'GET',
        headers: this.createHeaders(true),
      });

      const envelope = await this.parseAdminEnvelope<AdminUser[], AdminUsersFiltersApplied>(response);
      const baseResult = this.assertAdminEnvelope(envelope, 'getAdminUsers');
      
      // Mapeo a Entidades de Dominio Ricas (Fase 3)
      return {
        ...baseResult,
        data: baseResult.data.map(raw => new UserEntity(raw))
      };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Actualizar rol y perfil de un usuario desde el panel administrador
   */
  public async updateAdminUser(
    userId: string,
    payload: UpdateAdminUserPayload
  ): Promise<AdminUser> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: this.createHeaders(true),
        body: JSON.stringify(payload),
      });

      const envelope = await this.parseAdminEnvelope<AdminUser, never>(response);
      if (envelope.data === undefined) {
        throw new Error('Expected data property in response payload');
      }
      return envelope.data;
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Inhabilitar/Suspender cuenta de usuario
   */
  public async disableAdminUser(userId: string): Promise<AdminUser> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/users/${userId}/disable`, {
        method: 'POST',
        headers: this.createHeaders(true),
      });

      const envelope = await this.parseAdminEnvelope<AdminUser, never>(response);
      if (envelope.data === undefined) {
        throw new Error('Expected data property in response payload');
      }
      return envelope.data;
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Reactivar cuenta suspendida
   */
  public async reEnableAdminUser(userId: string): Promise<AdminUser> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/users/${userId}/enable`, {
        method: 'POST',
        headers: this.createHeaders(true),
      });

      const envelope = await this.parseAdminEnvelope<AdminUser, never>(response);
      if (envelope.data === undefined) {
        throw new Error('Expected data property in response payload');
      }
      return envelope.data;
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Eliminar usuario de forma permanente (Hard delete)
   */
  public async deleteAdminUserPermanently(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: this.createHeaders(true),
      });

      await this.parseAdminEnvelope<void, never>(response);
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Listado de suscripciones con filtros de auditoría
   */
  public async getAdminSubscriptions(
    params: GetAdminSubscriptionsParams = {}
  ): Promise<AdminSubscriptionsResult> {
    const query = this.buildQueryString(params as Record<string, unknown>);

    try {
      const response = await fetch(`${this.baseUrl}/api/admin/subscriptions${query}`, {
        method: 'GET',
        headers: this.createHeaders(true),
      });

      const envelope = await this.parseAdminEnvelope<AdminSubscription[], AdminSubscriptionsFiltersApplied>(response);
      const baseResult = this.assertAdminEnvelope(envelope, 'getAdminSubscriptions');
      
      return {
        ...baseResult,
        summaryCounts: envelope.summaryCounts!,
      } as AdminSubscriptionsResult;
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * KPIs financieros y métricas de registros por series de tiempo
   */
  public async getAdminMetrics(
    params: GetAdminMetricsParams = {}
  ): Promise<AdminMetricsResult> {
    const query = this.buildQueryString(params as Record<string, unknown>);

    try {
      const response = await fetch(`${this.baseUrl}/api/admin/metrics${query}`, {
        method: 'GET',
        headers: this.createHeaders(true),
      });

      const envelope = await this.parseAdminEnvelope<AdminMetricsResult['data'], AdminMetricsFiltersApplied>(response);
      
      if (envelope.data === undefined || !envelope.generatedAt || !envelope.filtersApplied) {
        throw new Error('Invalid metrics data');
      }

      return {
        data: envelope.data,
        filtersApplied: envelope.filtersApplied,
        generatedAt: envelope.generatedAt,
      };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Obtener preferencias de columnas/vista persistidas del administrador
   */
  public async getAdminPreferences(): Promise<AdminPreferencesResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/preferences`, {
        method: 'GET',
        headers: this.createHeaders(true),
      });

      const envelope = await this.parseAdminEnvelope<AdminPreferencesData, Record<string, never>>(response);

      if (envelope.data === undefined || !envelope.generatedAt) {
        throw new Error('Invalid preferences envelope');
      }

      return {
        data: envelope.data,
        generatedAt: envelope.generatedAt,
      };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Guardar la configuración visual del dashboard
   */
  public async updateAdminPreferences(
    payload: UpdateAdminPreferencesPayload
  ): Promise<AdminPreferencesResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/preferences`, {
        method: 'PUT',
        headers: this.createHeaders(true),
        body: JSON.stringify(payload),
      });

      const envelope = await this.parseAdminEnvelope<AdminPreferencesData, Record<string, never>>(response);
      
      if (envelope.data === undefined || !envelope.generatedAt) {
        throw new Error('Invalid preferences envelope on update');
      }

      return {
        data: envelope.data,
        generatedAt: envelope.generatedAt,
      };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }
}

