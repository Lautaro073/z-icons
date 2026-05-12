import type { CustomIcon } from "@/lib/api/backend";

/**
 * Rich Domain Model for Custom Icon asset catalog.
 * Encapsulates metadata Normalization and sanitization heuristics.
 */
export class IconEntity {
  constructor(public readonly raw: CustomIcon) {}

  get id(): string {
    return this.raw.id;
  }

  get name(): string {
    return this.raw.name;
  }

  get category(): string {
    return this.raw.category;
  }

  get svgContent(): string | undefined {
    return this.raw.svg_content;
  }

  /**
   * Normaliza el valor booleano de premium proveniente de distintas 
   * inconsistencias en el payload del backend (0/1 vs true/false vs strings).
   */
  public isPremium(): boolean {
    const value = this.raw.is_premium;
    if (value === true || value === 1 || String(value) === 'true') {
      return true;
    }
    return false;
  }

  /**
   * Consolida las distintas llaves posibles para el ID del creador.
   */
  public getCreatorId(): string | null {
    return this.raw.created_by || this.raw.create_by || null;
  }

  /**
   * Devuelve la antigüedad en días del activo desde su subida inicial.
   */
  public getAgeInDays(): number {
    if (!this.raw.created_at) return 0;
    
    const uploadedAt = new Date(this.raw.created_at).getTime();
    const now = Date.now();
    const diff = now - uploadedAt;
    
    if (diff <= 0) return 0;
    
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  
  /**
   * Verifica si el icono fue subido recientemente (últimas 48 horas)
   */
  public isNewlyCreated(): boolean {
    const age = this.getAgeInDays();
    return age <= 2;
  }
}
