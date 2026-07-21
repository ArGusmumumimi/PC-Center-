"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/lib/data/schema";
import { hasPermission, Permission } from "@/lib/rbac";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles,
  requiredPermission,
  fallbackPath = "/login"
}: ProtectedRouteProps) {
  const { session, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(fallbackPath);
      return;
    }

    let authorized = true;

    // Check role if specified
    if (allowedRoles && allowedRoles.length > 0 && session) {
      if (!allowedRoles.includes(session.role)) {
        authorized = false;
      }
    }

    // Check permission if specified
    if (requiredPermission && session) {
      if (!hasPermission(session.role, requiredPermission)) {
        authorized = false;
      }
    }

    if (!authorized) {
      // Redirect to home if logged in but unauthorized
      router.push("/");
    } else {
      setIsAuthorized(true);
    }
  }, [isLoading, isAuthenticated, session, allowedRoles, requiredPermission, router, fallbackPath]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
