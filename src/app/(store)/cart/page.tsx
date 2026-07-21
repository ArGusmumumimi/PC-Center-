"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, ShoppingCart, ArrowRight, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/format";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">ตะกร้าสินค้าของคุณว่างเปล่า</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          ดูเหมือนว่าคุณยังไม่ได้เพิ่มสินค้าใดๆ ลงในตะกร้า เลือกชมสินค้าที่น่าสนใจจากร้านของเราสิ
        </p>
        <Link href="/products" className={buttonVariants({ size: "lg" })}>
          เลือกซื้อสินค้า
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">ตะกร้าสินค้า ({itemCount} ชิ้น)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-card">
              {/* Image Placeholder */}
              <div className="w-full sm:w-32 aspect-square bg-gradient-to-br from-muted/80 to-muted/30 rounded-xl flex items-center justify-center font-black text-foreground/20 text-xl uppercase shrink-0 shadow-sm border border-muted/50">
                {item.name.split(' ')[0]}
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between gap-4">
                  <Link href={`/products/${item.productId}`} className="font-semibold truncate hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                  <div className="font-bold whitespace-nowrap">
                    {formatPrice(item.price)}
                  </div>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex items-center border rounded-md shadow-sm bg-background">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-none rounded-l-md hover:bg-muted"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-12 text-center text-sm font-semibold">
                      {item.quantity}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-none rounded-r-md hover:bg-muted"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    ลบ
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-card p-6 space-y-6">
            <h2 className="font-semibold text-lg">สรุปคำสั่งซื้อ</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>ยอดรวมสินค้า ({itemCount} ชิ้น)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>ค่าจัดส่ง</span>
                <span>คำนวณในขั้นตอนถัดไป</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>ยอดสุทธิ</span>
              <span className="text-primary">{formatPrice(subtotal)}</span>
            </div>

            <Button 
              size="lg" 
              className="w-full text-base h-12 rounded-xl font-semibold shadow-sm hover:scale-[1.02] transition-transform"
              onClick={() => router.push("/checkout")}
            >
              ดำเนินการสั่งซื้อ <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              การชำระเงินของคุณปลอดภัยด้วยระบบเข้ารหัสมาตรฐาน
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
