"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { OrderStore } from "@/lib/data/store";
import type { Order } from "@/lib/data/schema";
import { formatPrice, formatDate, getOrderStatusLabel, getStatusColor, getPaymentMethodLabel, getPaymentStatusLabel } from "@/lib/format";
import ProtectedRoute from "@/components/auth/protected-route";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Package, Truck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

function OrderDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { session } = useAuth();
  
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (id && session) {
        try {
          const res = await fetch(`/api/orders/${id}`, {
            headers: {
              "Authorization": `Bearer ${session.token}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setOrder(data.data);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrder();
  }, [id, session]);

  if (loading) return <div className="container py-24 text-center">กำลังโหลด...</div>;
  
  if (!order) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">ไม่พบคำสั่งซื้อ</h2>
        <Button onClick={() => router.push("/orders")}>กลับหน้ารวมคำสั่งซื้อ</Button>
      </div>
    );
  }

  // Determine timeline progress (0-4)
  const getTimelineStep = (status: string) => {
    switch (status) {
      case "pending": return 0;
      case "confirmed": return 1;
      case "processing": return 2;
      case "shipped": return 3;
      case "delivered": return 4;
      case "cancelled": return -1;
      default: return 0;
    }
  };

  const step = getTimelineStep(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/orders" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "pl-0 text-muted-foreground hover:text-foreground")}>
            <ChevronLeft className="mr-1 h-4 w-4" /> กลับหน้ารวมคำสั่งซื้อ
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">คำสั่งซื้อ #{order.id}</h1>
          <p className="text-muted-foreground mt-1">สั่งซื้อเมื่อ {formatDate(order.createdAt)}</p>
        </div>
        <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`} variant="outline">
          สถานะ: {getOrderStatusLabel(order.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Timeline */}
          {order.status !== "cancelled" && (
            <div className="bg-card border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6">สถานะการจัดส่ง</h2>
              <div className="relative">
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-muted -translate-y-1/2 rounded-full hidden sm:block"></div>
                <div 
                  className="absolute top-1/2 left-4 h-1 bg-primary -translate-y-1/2 rounded-full hidden sm:block transition-all duration-500"
                  style={{ width: `calc(${(step / 4) * 100}% - 32px)` }}
                ></div>
                
                <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-0 relative z-10">
                  {/* Step 0: Pending/Placed */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 bg-background ${step >= 0 ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"}`}>
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="text-left sm:text-center">
                      <div className={`text-sm font-medium ${step >= 0 ? "text-foreground" : "text-muted-foreground"}`}>รับคำสั่งซื้อ</div>
                    </div>
                  </div>

                  {/* Step 1: Confirmed */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 bg-background ${step >= 1 ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"}`}>
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="text-left sm:text-center">
                      <div className={`text-sm font-medium ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>ยืนยันการชำระเงิน</div>
                    </div>
                  </div>

                  {/* Step 2: Processing */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 bg-background ${step >= 2 ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"}`}>
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="text-left sm:text-center">
                      <div className={`text-sm font-medium ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>กำลังจัดเตรียม</div>
                    </div>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 bg-background ${step >= 3 ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"}`}>
                      <Truck className="h-4 w-4" />
                    </div>
                    <div className="text-left sm:text-center">
                      <div className={`text-sm font-medium ${step >= 3 ? "text-foreground" : "text-muted-foreground"}`}>อยู่ระหว่างจัดส่ง</div>
                      {order.trackingNumber && step >= 3 && (
                        <div className="text-xs text-muted-foreground mt-1">{order.trackingNumber}</div>
                      )}
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 bg-background ${step >= 4 ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"}`}>
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="text-left sm:text-center">
                      <div className={`text-sm font-medium ${step >= 4 ? "text-foreground" : "text-muted-foreground"}`}>ส่งมอบสำเร็จ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-card border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-6">รายการสินค้า</h2>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-20 h-20 bg-muted rounded-md flex-shrink-0 flex items-center justify-center text-xs font-medium text-muted-foreground">
                    IMG
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`} className="font-medium hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                    <div className="text-sm text-muted-foreground mt-1">
                      ราคาต่อชิ้น: {formatPrice(item.price)}
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="text-sm font-medium">จำนวน: {item.quantity}</div>
                      <div className="font-semibold text-primary">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Summary */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-4">สรุปยอดรวม</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ยอดรวมสินค้า</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ค่าจัดส่ง</span>
                <span>{order.shipping === 0 ? "ฟรี" : formatPrice(order.shipping)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>ส่วนลด</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-bold text-lg">
              <span>ยอดสุทธิ</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-4">ข้อมูลการจัดส่ง</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs mb-1">ชื่อผู้รับ</span>
                <span className="font-medium">{order.shippingAddress.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-1">เบอร์โทรศัพท์</span>
                <span className="font-medium">{order.shippingAddress.phone}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-1">ที่อยู่จัดส่ง</span>
                <span className="font-medium">{order.shippingAddress.address}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-4">การชำระเงิน</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs mb-1">ช่องทางชำระเงิน</span>
                <span className="font-medium">{getPaymentMethodLabel(order.paymentMethod)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-1">สถานะการชำระเงิน</span>
                <Badge className={`${getStatusColor(order.paymentStatus)} text-xs`} variant="outline">
                  {getPaymentStatusLabel(order.paymentStatus)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <OrderDetailContent />
    </ProtectedRoute>
  );
}
