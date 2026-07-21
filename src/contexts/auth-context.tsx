"use client";
// ============================================================
// PC Center — Auth Context
// ============================================================
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { UserRole } from "@/lib/data/schema";
import type { AuthSession } from "@/lib/auth";
import { login as doLogin, register as doRegister, logout as doLogout, getSession } from "@/lib/auth";
import { initializeStore } from "@/lib/data/store";

interface AuthContextType {
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string, address?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeStore();
    const s = getSession();
    setSession(s);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await doLogin(email, password);
    if ("session" in result) {
      setSession(result.session);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, phone?: string, address?: string) => {
    const result = await doRegister(name, email, password, phone, address);
    if ("session" in result) {
      setSession(result.session);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const logout = useCallback(() => {
    doLogout();
    setSession(null);
  }, []);

  const hasRole = useCallback(
    (role: UserRole) => session?.role === role,
    [session]
  );

  const hasAnyRole = useCallback(
    (...roles: UserRole[]) => !!session && roles.includes(session.role),
    [session]
  );

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isAuthenticated: !!session,
        login,
        register,
        logout,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
