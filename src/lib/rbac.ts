// ============================================================
// PC Center — RBAC (Role-Based Access Control)
// ============================================================
import type { UserRole } from "./data/schema";

export type Permission =
  | "products:read"
  | "products:create"
  | "products:update"
  | "products:delete"
  | "categories:read"
  | "categories:manage"
  | "orders:read_own"
  | "orders:read_all"
  | "orders:create"
  | "orders:update_status"
  | "cart:manage"
  | "reviews:create"
  | "reviews:read"
  | "users:read"
  | "users:manage"
  | "promotions:read"
  | "promotions:manage"
  | "dashboard:view"
  | "inventory:manage"
  | "customers:read";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  customer: [
    "products:read",
    "categories:read",
    "orders:read_own",
    "orders:create",
    "cart:manage",
    "reviews:create",
    "reviews:read",
    "promotions:read",
  ],
  staff: [
    "products:read",
    "categories:read",
    "orders:read_all",
    "orders:update_status",
    "reviews:read",
    "promotions:read",
    "customers:read",
    "inventory:manage",
  ],
  manager: [
    "products:read",
    "products:create",
    "products:update",
    "products:delete",
    "categories:read",
    "categories:manage",
    "orders:read_all",
    "orders:update_status",
    "reviews:read",
    "promotions:read",
    "promotions:manage",
    "users:read",
    "users:manage",
    "dashboard:view",
    "customers:read",
    "inventory:manage",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function canAccessDashboard(role: UserRole): boolean {
  return role === "staff" || role === "manager";
}

export function canManageProducts(role: UserRole): boolean {
  return role === "manager";
}

export function canManageOrders(role: UserRole): boolean {
  return role === "staff" || role === "manager";
}

export function canManageUsers(role: UserRole): boolean {
  return role === "manager";
}

export function canManagePromotions(role: UserRole): boolean {
  return role === "manager";
}

export function canViewDashboard(role: UserRole): boolean {
  return role === "manager";
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    customer: "ลูกค้า",
    staff: "พนักงาน",
    manager: "ผู้จัดการ",
  };
  return labels[role] || role;
}

export function getRoleBadgeVariant(role: UserRole): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
    manager: "default",
    staff: "secondary",
    customer: "outline",
  };
  return variants[role] || "outline";
}
