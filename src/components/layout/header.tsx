"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { canAccessDashboard } from "@/lib/rbac";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import {
  Search, ShoppingCart, User, LogOut, LayoutDashboard,
  Package, Menu, X, Minus, Plus, Trash2,
} from "lucide-react";
import NotificationBell from "@/components/layout/notification-bell";

export default function Header() {
  const { session, isAuthenticated, logout } = useAuth();
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-black">
              PC
            </div>
            <span className="hidden sm:inline">PC Center</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            หน้าแรก
          </Link>
          <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
            สินค้าทั้งหมด
          </Link>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="h-4 w-4" />
            </button>
            <Input
              placeholder="ค้นหาสินค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Cart - only for customers */}
          {isAuthenticated && session?.role === "customer" && (
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="relative" />}>
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                      {itemCount}
                    </Badge>
                  )}
              </SheetTrigger>
              <SheetContent className="flex flex-col">
                <SheetHeader className="px-6 py-4 border-b">
                  <SheetTitle>ตะกร้าสินค้า ({itemCount})</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mb-4" />
                      <p>ตะกร้าว่าง</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.productId} className="flex gap-3">
                          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                            IMG
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Button variant="outline" size="icon" className="h-6 w-6"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm w-6 text-center">{item.quantity}</span>
                              <Button variant="outline" size="icon" className="h-6 w-6"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto text-destructive"
                                onClick={() => removeItem(item.productId)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {items.length > 0 && (
                  <div className="px-6 py-6 border-t bg-muted/10 space-y-4">
                    <div className="flex justify-between text-base">
                        <span>รวม</span>
                        <span className="font-bold">{formatPrice(subtotal)}</span>
                      </div>
                      <Button className="w-full" onClick={() => router.push("/cart")}>
                        ดูตะกร้าสินค้า
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => router.push("/checkout")}>
                        สั่งซื้อสินค้า
                      </Button>
                    </div>
                )}
              </SheetContent>
            </Sheet>
          )}

          <NotificationBell />

          {/* User Menu */}
          {isAuthenticated ? (
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
                      <Badge variant="secondary" className="mt-1 w-fit text-[10px]">
                        {session?.role === "manager" ? "ผู้จัดการ" : session?.role === "staff" ? "พนักงาน" : "ลูกค้า"}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {session?.role === "customer" && (
                  <DropdownMenuItem onClick={() => router.push("/orders")}>
                    <Package className="mr-2 h-4 w-4" />
                    คำสั่งซื้อของฉัน
                  </DropdownMenuItem>
                )}
                {session && canAccessDashboard(session.role) && (
                  <DropdownMenuItem onClick={() => router.push(session.role === "manager" ? "/dashboard" : "/dashboard/orders")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {session.role === "manager" ? "แดชบอร์ด" : "จัดการคำสั่งซื้อ"}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); router.push("/"); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                เข้าสู่ระบบ
              </Button>
              <Button size="sm" onClick={() => router.push("/register")}>
                สมัครสมาชิก
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="ค้นหาสินค้า..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
          </form>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}>หน้าแรก</Link>
            <Link href="/products" className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}>สินค้าทั้งหมด</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
