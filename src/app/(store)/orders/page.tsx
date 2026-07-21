"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { OrderStore } from "@/lib/data/store";
import type { Order } from "@/lib/data/schema";
import { formatPrice, formatShortDate, getOrderStatusLabel, getStatusColor } from "@/lib/format";
import ProtectedRoute from "@/components/auth/protected-route";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PackageSearch, ChevronRight, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function OrdersContent() {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session) {
        try {
          const res = await fetch("/api/orders", {
            headers: {
              "Authorization": `Bearer ${session.token}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setOrders(data.data);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [session]);

  if (loading) {
    return <div className="container py-24 text-center">กำลังโหลดข้อมูล...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <PackageSearch className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">ยังไม่มีคำสั่งซื้อ</h1>
        <p className="text-muted-foreground mb-8">
          คุณยังไม่เคยทำการสั่งซื้อสินค้ากับเรา เริ่มเลือกซื้อสินค้าที่คุณสนใจได้เลย
        </p>
        <Link href="/products" className={buttonVariants()}>
          เลือกซื้อสินค้า
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">คำสั่งซื้อของฉัน</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30 border-b p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">เลขที่คำสั่งซื้อ</span>
                  <span className="font-semibold">{order.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">วันที่สั่งซื้อ</span>
                  <span className="font-medium">{formatShortDate(order.createdAt)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">ยอดรวม</span>
                  <span className="font-semibold text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(order.status)} variant="outline">
                  {getOrderStatusLabel(order.status)}
                </Badge>
                <Link href={`/orders/${order.id}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden sm:flex")}>
                    รายละเอียด <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.items.slice(0, 2).map((item) => (
                  <div key={item.productId} className="flex gap-4 p-4 sm:p-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-md flex-shrink-0 flex items-center justify-center text-xs font-medium text-muted-foreground">
                      IMG
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.productId}`} className="font-medium line-clamp-1 hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1">
                        จำนวน: {item.quantity} ชิ้น
                      </div>
                      <div className="font-medium mt-1">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {order.items.length > 2 && (
                  <div className="p-3 text-center text-sm text-muted-foreground bg-muted/10">
                    และสินค้าอื่นๆ อีก {order.items.length - 2} รายการ
                  </div>
                )}
              </div>
              
              {/* Mobile View details button */}
              <div className="p-4 border-t sm:hidden">
                <Link href={`/orders/${order.id}`} className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
                    ดูรายละเอียดคำสั่งซื้อ <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <OrdersContent />
    </ProtectedRoute>
  );
}
