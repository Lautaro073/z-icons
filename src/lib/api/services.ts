import { AuthService } from "@/features/auth/services/AuthService";
import { UserService } from "@/features/user/services/UserService";
import { AdminService } from "@/features/admin/services/AdminService";
import { IconService } from "@/features/icons-explorer/services/IconService";

// Leemos la configuración del entorno actual
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const authService = new AuthService(API_BASE_URL);
export const userService = new UserService(API_BASE_URL);
export const adminService = new AdminService(API_BASE_URL);
export const iconService = new IconService(API_BASE_URL);

// Exportamos también las clases por si alguien necesitara instanciarlas individualmente (Testeo)
export { AuthService, UserService, AdminService, IconService };
