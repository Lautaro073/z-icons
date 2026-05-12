"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import {
    login as backendLogin,
    register as backendRegister,
    logout as backendLogout,
    getRefreshTokenFromServer,
    refreshAccessToken as backendRefreshAccessToken,
} from '@/features/auth/services/auth';
import {
    setCurrentAccessToken,
    clearTokens,
    getRefreshToken,
    setRefreshToken,
    setUserRoleHint,
    type User,
} from '@/lib/api/backend';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string, twoFactorCode?: string) => Promise<User>;
    register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface RuntimeAuthSnapshot {
    user: User | null;
    accessToken: string | null;
    initialized: boolean;
}

const runtimeAuthSnapshot: RuntimeAuthSnapshot = {
    user: null,
    accessToken: null,
    initialized: false,
};

const normalizeUserRole = (userObj: User | null): User | null => {
    if (!userObj) {
        return null;
    }

    if (userObj.role_name || !(userObj as unknown as { role?: string }).role) {
        return userObj;
    }

    return {
        ...userObj,
        role_name: (userObj as unknown as { role: 'admin' | 'user' | 'pro' }).role,
    } as User;
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => runtimeAuthSnapshot.user);
    const [accessToken, setAccessToken] = useState<string | null>(() => runtimeAuthSnapshot.accessToken);
    const [isLoading, setIsLoading] = useState(() => !runtimeAuthSnapshot.initialized);

    const synchronizeAuthState = (accessToken: string, userObj: User | null) => {
        setAccessToken(accessToken);
        setUser(userObj);
        setCurrentAccessToken(accessToken);
        setUserRoleHint(userObj?.role_name ?? (userObj as { role?: string } | undefined)?.role ?? null);
        runtimeAuthSnapshot.user = userObj;
        runtimeAuthSnapshot.accessToken = accessToken;
        runtimeAuthSnapshot.initialized = true;
    };

    // Sincronizar token con backend.ts cada vez que cambie
    useEffect(() => {
        setCurrentAccessToken(accessToken);
        runtimeAuthSnapshot.user = user;
        runtimeAuthSnapshot.accessToken = accessToken;
    }, [accessToken, user]);

    // Refrescar access token usando backend.ts
    const refreshAccessTokenInternal = useCallback(async (): Promise<string | null> => {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            await logoutInternal();
            return null;
        }

        try {
            const data = await backendRefreshAccessToken();

            // Mapear role a role_name si es necesario
            const normalizedUser = normalizeUserRole(data.user);
            synchronizeAuthState(data.accessToken, normalizedUser);
            return data.accessToken;
        } catch {
            await logoutInternal();
            return null;
        }
    }, []);

    // Obtener refresh token del servidor (después de login/register)
    const storeRefreshToken = async (): Promise<void> => {
        try {
            const data = await getRefreshTokenFromServer();
            setRefreshToken(data.refreshToken, data.expiresAt);
        } catch (error) {
            console.error('Error getting refresh token:', error);
        }
    };

    // Login
    const login = async (email: string, password: string, twoFactorCode?: string): Promise<User> => {
        const data = await backendLogin(email, password, twoFactorCode);
        const normalizedUser = normalizeUserRole(data.user);

        synchronizeAuthState(data.accessToken, normalizedUser);
        await storeRefreshToken();
        return normalizedUser!;
    };

    // Register
    const register = async (username: string, email: string, password: string, confirmPassword: string) => {
        const data = await backendRegister(username, email, password, confirmPassword);
        const normalizedUser = normalizeUserRole(data.user);

        synchronizeAuthState(data.accessToken, normalizedUser);
        await storeRefreshToken();
    };



    // Logout interno (sin redirigir)
    const logoutInternal = async () => {
        setAccessToken(null);
        setUser(null);
        setUserRoleHint(null);
        runtimeAuthSnapshot.user = null;
        runtimeAuthSnapshot.accessToken = null;
        runtimeAuthSnapshot.initialized = true;
        clearTokens();
    };

    // Logout público (con redirección)
    const logout = async () => {
        try {
            if (accessToken) {
                await backendLogout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            await logoutInternal();
            if (typeof window !== 'undefined') {
                window.location.assign('/auth/login');
            }
        }
    };

    // Refrescar perfil manual (útil para premium success)
    const refreshSession = useCallback(async () => {
        await refreshAccessTokenInternal();
    }, [refreshAccessTokenInternal]);

    // Restaurar sesión al cargar la app
    useEffect(() => {
        if (runtimeAuthSnapshot.initialized) {
            setUser(runtimeAuthSnapshot.user);
            setAccessToken(runtimeAuthSnapshot.accessToken);
            setCurrentAccessToken(runtimeAuthSnapshot.accessToken);
            setIsLoading(false);
            return;
        }

        const restoreSession = async () => {
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                await refreshAccessTokenInternal();
            }
            runtimeAuthSnapshot.initialized = true;
            setIsLoading(false);
        };
        restoreSession();
    }, [refreshAccessTokenInternal]);

    // Auto-refresh cada 4 minutos
    useEffect(() => {
        if (!accessToken) return;
        const interval = setInterval(async () => {
            await refreshAccessTokenInternal();
        }, 4 * 60 * 1000);
        return () => clearInterval(interval);
    }, [accessToken, refreshAccessTokenInternal]);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isLoading,
                isAuthenticated: !!user && !!accessToken,
                login,
                register,
                logout,
                refreshSession
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
