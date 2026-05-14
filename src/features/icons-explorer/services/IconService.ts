import { BaseApiClient } from "@/lib/api/BaseApiClient";
import { IconEntity } from "@/features/icons-explorer/models/IconEntity";
import {
  SettingsIcons,
  CustomIcon,
  CustomIconPayload
} from "@/lib/api/backend";

export class IconService extends BaseApiClient {
  /**
   * Obtener la configuración visual de la librería del usuario
   */
  public async getMyIconSettings(): Promise<SettingsIcons | null> {
    const response = await fetch(`${this.baseUrl}/api/settings-icons/me`, {
      method: 'GET',
      headers: this.createHeaders(true),
    });

    try {
      return await this.parseResponse<SettingsIcons>(response);
    } catch (e) {
      return null;
    }
  }

  /**
   * Actualizar la configuración visual (colores, trazo preferido)
   */
  public async updateIconSettings(
    payload: Partial<Omit<SettingsIcons, 'id' | 'created_at'>>
  ): Promise<SettingsIcons> {
    const response = await fetch(`${this.baseUrl}/api/settings-icons`, {
      method: 'POST',
      headers: this.createHeaders(true),
      body: JSON.stringify(payload),
    });

    return this.parseResponse<SettingsIcons>(response);
  }

  /**
   * Obtener todos los iconos personalizados del repositorio (Admin/Builder)
   * Retorna una colección de IconEntity (Fase 3).
   */
  public async getCustomIcons(): Promise<IconEntity[]> {
    const response = await fetch(`${this.baseUrl}/api/custom-icons`, {
      method: 'GET',
      headers: this.createHeaders(true),
    });

    const rawData = await this.parseResponse<Record<string, unknown> | CustomIcon[]>(response);
    let rawIcons: CustomIcon[] = [];

    if (Array.isArray(rawData)) {
      rawIcons = rawData as CustomIcon[];
    } else {
      const obj = rawData as Record<string, unknown>;
      if (Array.isArray(obj.icons)) rawIcons = obj.icons as CustomIcon[];
      else if (Array.isArray(obj.data)) rawIcons = obj.data as CustomIcon[];
      else rawIcons = rawData as unknown as CustomIcon[];
    }

    // Envolver en Entidades Ricas
    return rawIcons.map(raw => new IconEntity(raw));
  }

  /**
   * Crear un único icono SVG personalizado
   */
  public async createCustomIcon(payload: CustomIconPayload): Promise<CustomIcon> {
    const response = await fetch(`${this.baseUrl}/api/custom-icons`, {
      method: 'POST',
      headers: this.createHeaders(true),
      body: JSON.stringify(payload),
    });

    return this.parseResponse<CustomIcon>(response);
  }

  /**
   * Inserción masiva de iconos (Bulk Upload)
   */
  public async createCustomIconsBulk(payloadArray: CustomIconPayload[]): Promise<CustomIcon[]> {
    const response = await fetch(`${this.baseUrl}/api/custom-icons/bulk`, {
      method: 'POST',
      headers: this.createHeaders(true),
      body: JSON.stringify({ icons: payloadArray }),
    });

    return this.parseResponse<CustomIcon[]>(response);
  }

  /**
   * Actualizar metadatos o vector de un icono existente
   */
  public async updateCustomIcon(
    id: string,
    payload: Partial<CustomIconPayload>
  ): Promise<CustomIcon> {
    const response = await fetch(`${this.baseUrl}/api/custom-icons/${id}`, {
      method: 'PATCH',
      headers: this.createHeaders(true),
      body: JSON.stringify(payload),
    });

    return this.parseResponse<CustomIcon>(response);
  }

  /**
   * Eliminación definitiva de un icono del repositorio general
   */
  public async deleteCustomIcon(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/custom-icons/${id}`, {
      method: 'DELETE',
      headers: this.createHeaders(true),
    });

    await this.parseResponse<void>(response);
  }
}

