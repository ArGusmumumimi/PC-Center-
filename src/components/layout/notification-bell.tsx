"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import type { AppNotification } from "@/lib/data/schema";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const POLL_INTERVAL_MS = 20000;

export default function NotificationBell() {
  const { session, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    if (!session?.token) return;
    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount);
      }
    } catch (e) {
      console.error(e);
    }
  }, [session?.token]);

  useEffect(() => {
    if (!isAuthenticated) return;
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isAuthenticated, load]);

  const markRead = async (id: string) => {
    if (!session?.token) return;
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ id }),
    });
  };

  const markAllRead = async () => {
    if (!session?.token) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
      body: JSON.stringify({}),
    });
  };

  if (!isAuthenticated) return null;

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="ghost" size="icon" className="relative" />}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2.5 border-b">
          <span className="font-semibold text-sm">การแจ้งเตือน</span>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline">
              อ่านทั้งหมด
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">ยังไม่มีการแจ้งเตือน</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={n.orderId ? (session?.role === "customer" ? `/orders/${n.orderId}` : "/dashboard/orders") : "#"}
                onClick={() => !n.read && markRead(n.id)}
                className={cn(
                  "block px-3 py-2.5 text-sm border-b last:border-0 hover:bg-muted/50 transition-colors",
                  !n.read && "bg-primary/5"
                )}
              >
                <div className="flex items-start gap-2">
                  {!n.read && <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                  <div className={cn("flex-1 min-w-0", n.read && "pl-3.5")}>
                    <p className="leading-snug">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(n.createdAt)}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
