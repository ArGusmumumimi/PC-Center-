"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { canAccessDashboard } from "@/lib/rbac";
import Sidebar from "./sidebar";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, Home, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (!isLoading && isAuthenticated && session && !canAccessDashboard(session.role)) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, session, router]);

  if (isLoading || !isAuthenticated || (session && !canAccessDashboard(session.role))) {
    return <div className="flex h-screen w-full items-center justify-center">กำลังโหลด...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
                  <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <div className="h-full flex flex-col">
                  <Sidebar />
                </div>
              </SheetContent>
            </Sheet>
            
            <h1 className="text-lg font-semibold truncate hidden sm:block">PC Center Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/")} className="hidden sm:flex">
              <Home className="mr-2 h-4 w-4" />
              กลับหน้าแรก
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                  <User className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{session?.name}</span>
                      <span className="text-xs text-muted-foreground">{session?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/")}>
                  <Home className="mr-2 h-4 w-4" />
                  หน้าแรกร้านค้า
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { logout(); router.push("/login"); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
