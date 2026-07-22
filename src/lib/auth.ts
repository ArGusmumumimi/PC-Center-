// ============================================================
// PC Center — Auth System
// ============================================================
import type { UserRole } from "./data/schema";
import { encryptData, decryptData } from "./encryption";

const AUTH_KEY = "pc_center_auth_session";

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  token: string;
}

export async function login(email: string, password: string): Promise<{ session: AuthSession } | { error: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      const session: AuthSession = {
        userId: data.data.user.id,
        email: data.data.user.email,
        name: data.data.user.name,
        role: data.data.user.role,
        token: data.data.token,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_KEY, encryptData(session));
      }
      return { session };
    }
    return { error: data.error || "เข้าสู่ระบบไม่สำเร็จ" };
  } catch (error) {
    return { error: "Network error" };
  }
}

export async function register(
  name: string,
  email: string,
  password: string,
  phone: string = "",
  address: string = ""
): Promise<{ session: AuthSession } | { error: string }> {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone, address }),
    });
    const data = await res.json();
    if (data.success) {
      const session: AuthSession = {
        userId: data.data.user.id,
        email: data.data.user.email,
        name: data.data.user.name,
        role: data.data.user.role,
        token: data.data.token,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_KEY, encryptData(session));
      }
      return { session };
    }
    return { error: data.error || "สมัครสมาชิกไม่สำเร็จ" };
  } catch (error) {
    return { error: "Network error" };
  }
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? (decryptData(data) as AuthSession) : null;
  } catch {
    return null;
  }
}

// For API routes — extract token from header
export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  if (authHeader.startsWith("Bearer ")) return authHeader.slice(7);
  return authHeader;
}
