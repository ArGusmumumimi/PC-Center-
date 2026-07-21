"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { 
  LayoutDashboard, ShoppingBag, Users, Tags, 
  Settings, Package, Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const { session } = useAuth();
  
  const isManager = session?.role === "manager";

  const navItems = [
    {
      title: "ภาพรวม (Dashboard)",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["manager"],
    },
    {
      title: "จัดการคำสั่งซื้อ",
      href: "/dashboard/orders",
      icon: ShoppingBag,
      roles: ["staff"], // Only staff
    },
    {
      title: "จัดการสินค้า",
      href: "/dashboard/products",
      icon: Package,
      roles: ["manager"], // Only manager
    },

    {
      title: "ดูข้อมูลลูกค้า",
      href: "/dashboard/customers",
      icon: Users,
      roles: ["manager"], // Only manager
    },
    {
      title: "จัดการผู้ใช้งาน",
      href: "/dashboard/users",
      icon: Settings,
      roles: ["manager"], // Only manager
    },
  ];

  // Filter based on role
  const filteredNav = navItems.filter(item => 
    session && item.roles.includes(session.role)
  );

  return (
    <aside className="w-64 border-r bg-muted/20 hidden md:block">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-black">
            PC
          </div>
          Admin Panel
        </Link>
      </div>
      <div className="p-4 space-y-1">
        {filteredNav.map((item) => {
          const isActive = item.href === "/dashboard" 
            ? pathname === item.href 
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
