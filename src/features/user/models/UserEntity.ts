import type { AdminUser, AdminRole } from "@/types/admin";

/**
 * Rich Domain Model representing a User.
 * Encapsulates business invariant logic and formatted view model accessors.
 */
export class UserEntity {
  constructor(public readonly raw: AdminUser) {}

  get id(): string {
    return this.raw.id;
  }

  get displayName(): string {
    return this.raw.username;
  }

  get email(): string {
    return this.raw.email;
  }

  get role(): AdminRole {
    return this.raw.role_name;
  }

  get createdAt(): Date {
    return new Date(this.raw.created_at);
  }

  get updatedAt(): Date {
    return new Date(this.raw.updated_at);
  }

  // Business Logic encapsulation
  public isAdmin(): boolean {
    return this.raw.role_name === 'admin';
  }

  public isPro(): boolean {
    return this.raw.role_name === 'pro';
  }

  public isDisabled(): boolean {
    return this.raw.accountStatus === 'disabled';
  }

  public hasActiveSubscription(): boolean {
    return this.raw.subscriptionStatus === 'active';
  }

  /**
   * Determina si una cuenta administrativa puede eliminar este registro de usuario.
   * Evita el auto-borrado accidentado en interfaces visuales.
   */
  public canBeDeletedBy(currentUserId: string): boolean {
    return this.raw.id !== currentUserId;
  }

  /**
   * Devuelve los días restantes antes del vencimiento del token premium,
   * o null si no posee token vigente.
   */
  public getSubscriptionDaysLeft(): number | null {
    if (!this.raw.token_finish_date) return null;
    
    const expiryTime = new Date(this.raw.token_finish_date).getTime();
    const nowTime = Date.now();
    const diffMs = expiryTime - nowTime;

    if (diffMs <= 0) return 0;

    // Redondear hacia arriba la cantidad de días restantes
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Valida si la suscripción está en período crítico de expiración (menos de 7 días)
   */
  public isExpiringSoon(): boolean {
    const days = this.getSubscriptionDaysLeft();
    return days !== null && days > 0 && days <= 7;
  }
}
