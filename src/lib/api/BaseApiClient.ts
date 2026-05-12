import { 
  ApiResponse, 
  BackendApiError, 
  AdminPagination,
  AdminSubscriptionsSummaryCounts 
} from "./backend";

// Interface para sobrescribir el shape envelope del backend original
export interface AdminApiEnvelope<TData, TFilters> extends ApiResponse<TData> {
  pagination?: AdminPagination;
  filtersApplied?: TFilters;
  generatedAt?: string;
  summaryCounts?: AdminSubscriptionsSummaryCounts;
  invalidParam?: string;
  expected?: string;
  received?: string;
}

/**
 * Abstracción POO para comunicación HTTP.
 * Centraliza la URL base, headers de autenticación compartidos, el manejo de tokens
 * mediante estáticos (Singleton Pattern) y la lógica de deserialización/parseo.
 */
export abstract class BaseApiClient {
  // Propiedades de instancia configurables
  protected readonly baseUrl: string;

  // ESTADO COMPARTIDO (Singleton Pattern aplicado a la Clase):
  // Para que todas las subclases de servicios compartan el mismo token de acceso.
  private static accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  // ==================== ACCESO A TOKENS (ESTÁTICOS) ====================

  public static setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  public static getAccessToken(): string | null {
    return this.accessToken;
  }

  // ==================== UTILS DE RED (ENCAPSULADOS) ====================

  /**
   * Inyecta el token Bearer si corresponde de forma automática.
   */
  protected createHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = BaseApiClient.getAccessToken();
    if (includeAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Serializa parámetros de filtrado a Query String.
   */
  protected buildQueryString(params: Record<string, unknown>): string {
    const search = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      search.set(key, String(value));
    });

    const query = search.toString();
    return query ? `?${query}` : '';
  }

  // ==================== PARSEO DE RESPUESTAS ====================

  /**
   * Parsea respuestas genéricas ApiResponse<T>
   */
  protected async parseResponse<TData>(response: Response): Promise<TData> {
    let payload: ApiResponse<TData>;
    
    try {
      payload = (await response.json()) as ApiResponse<TData>;
    } catch (e) {
      throw new BackendApiError('Invalid backend response format', response.status || 500);
    }

    if (!response.ok || !payload.success) {
      // Algunos endpoints devuelven data even on error if they have specialized payloads (like 2FA)
      throw new Error(payload.message || 'API request failed');
    }

    // Retornamos la data real, garantizada como presente en este backend al ser exitoso
    return payload.data as TData;
  }

  /**
   * Especialización para parsear envelopes administrativos paginados
   */
  protected async parseAdminEnvelope<TData, TFilters>(
    response: Response
  ): Promise<AdminApiEnvelope<TData, TFilters>> {
    let payload: AdminApiEnvelope<TData, TFilters>;

    try {
      payload = (await response.json()) as AdminApiEnvelope<TData, TFilters>;
    } catch {
      throw new BackendApiError('Invalid backend response format', response.status || 500);
    }

    if (!response.ok || !payload.success) {
      throw new BackendApiError(payload.message || 'Admin API request failed', response.status || 500, {
        invalidParam: payload.invalidParam,
        expected: payload.expected,
        received: payload.received,
      });
    }

    return payload;
  }

  /**
   * Garantiza la forma final desempaquetada de los datos administrativos.
   */
  protected assertAdminEnvelope<TData, TFilters>(
    payload: AdminApiEnvelope<TData, TFilters>,
    endpointName: string
  ) {
    if (payload.data === undefined || payload.pagination === undefined || payload.filtersApplied === undefined || !payload.generatedAt) {
      throw new BackendApiError(`Invalid admin envelope from ${endpointName}`, 500);
    }

    return {
      data: payload.data,
      pagination: payload.pagination,
      filtersApplied: payload.filtersApplied,
      generatedAt: payload.generatedAt,
      summaryCounts: payload.summaryCounts
    };
  }

  /**
   * Manejo centralizado de la caducidad de sesión (Status 401)
   */
  protected handleAuthError(error: unknown): never {
    // Si es error de backend y es 401 Unauthorized
    if (error instanceof BackendApiError && error.status === 401) {
      // IMPORTANTE: Limpieza asincrónica de tokens se maneja fuera o a través de clearTokens().
      // Relanzamos para que el contexto reaccione
      throw new BackendApiError('SESSION_EXPIRED', 401);
    }

    throw error;
  }
}
