"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/format";
import { OrderStore, UserStore, generateId } from "@/lib/data/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/protected-route";
import { CheckCircle2, QrCode, CreditCard } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const { session } = useAuth();
  const { items, itemCount, subtotal, clearCart } = useCart();
  
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "credit_card",
    ccNumber: "",
    ccExpiry: "",
    ccCvc: "",
    ccName: "",
  });

  useEffect(() => {
    setMounted(true);
    if (session?.userId) {
      const user = UserStore.getById(session.userId);
      setFormData(prev => ({
        ...prev,
        name: session.name || user?.name || "",
        phone: user?.phone || "",
        address: user?.address || "",
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, [name]: numericValue });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setFormData({ ...formData, ccNumber: formatted.substring(0, 19) });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setFormData({ ...formData, ccExpiry: value.substring(0, 5) });
  };

  const handlePaymentChange = (value: string) => {
    setFormData({ ...formData, paymentMethod: value });
  };

  const shippingFee = subtotal > 5000 ? 0 : 50;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    if (items.length === 0) {
      toast.error("ตะกร้าสินค้าว่างเปล่า");
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("กรุณากรอกข้อมูลการจัดส่งให้ครบถ้วน");
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        userId: session.userId,
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image
        })),
        subtotal,
        shipping: shippingFee,
        discount: 0,
        total,
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        },
        paymentMethod: formData.paymentMethod,
        paymentStatus: "paid",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.token}` 
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        setSuccessOrderId(data.data.id);
      } else {
        toast.error(data.error || "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ");
      }
    } catch (e) {
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (successOrderId) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="h-20 w-20 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold tracking-tight mb-2">สั่งซื้อสำเร็จ!</h1>
        <p className="text-muted-foreground mb-2">
          หมายเลขคำสั่งซื้อของคุณคือ <span className="font-semibold text-foreground">{successOrderId}</span>
        </p>
        <p className="text-muted-foreground mb-8">
          เราได้รับคำสั่งซื้อของคุณแล้ว และจะดำเนินการจัดส่งให้เร็วที่สุด
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push("/")}>กลับหน้าแรก</Button>
          <Button onClick={() => router.push(`/orders/${successOrderId}`)}>ดูคำสั่งซื้อ</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">ชำระเงิน</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Form */}
          <section className="bg-card border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">ข้อมูลการจัดส่ง</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleNumericChange} required maxLength={10} inputMode="numeric" />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <Label htmlFor="address">ที่อยู่จัดส่งแบบเต็ม</Label>
                <textarea 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange as any} 
                  required
                  rows={4}
                  className="w-full flex min-h-[120px] rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none shadow-sm"
                  placeholder="บ้านเลขที่, หมู่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"
                />
              </div>
            </form>
          </section>

          {/* Payment Method */}
          <section className="bg-card border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">วิธีการชำระเงิน</h2>
            <RadioGroup value={formData.paymentMethod} onValueChange={(v) => handlePaymentChange(v || "")} className="space-y-4">
              <div className="border rounded-xl overflow-hidden shadow-sm transition-all has-[:checked]:border-primary/50 has-[:checked]:bg-muted/10">
                <div className="flex items-center space-x-4 p-5 cursor-pointer hover:bg-muted/30">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex-1 cursor-pointer font-medium text-base flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    บัตรเครดิต / เดบิต
                  </Label>
                </div>
                {formData.paymentMethod === "credit_card" && (
                  <div className="p-5 border-t bg-muted/20 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label>หมายเลขบัตร</Label>
                      <Input placeholder="0000 0000 0000 0000" maxLength={19} value={formData.ccNumber} onChange={handleCardNumberChange} inputMode="numeric" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>วันหมดอายุ (MM/YY)</Label>
                        <Input placeholder="MM/YY" maxLength={5} value={formData.ccExpiry} onChange={handleExpiryChange} inputMode="numeric" />
                      </div>
                      <div className="space-y-2">
                        <Label>รหัส CVC</Label>
                        <Input placeholder="123" maxLength={3} type="password" name="ccCvc" value={formData.ccCvc} onChange={handleNumericChange} inputMode="numeric" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>ชื่อบนบัตร</Label>
                      <Input placeholder="JOHN DOE" name="ccName" value={formData.ccName} onChange={(e) => setFormData({...formData, ccName: e.target.value.toUpperCase()})} />
                    </div>
                  </div>
                )}
              </div>

              <div className="border rounded-xl overflow-hidden shadow-sm transition-all has-[:checked]:border-primary/50 has-[:checked]:bg-muted/10">
                <div className="flex items-center space-x-4 p-5 cursor-pointer hover:bg-muted/30">
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer font-medium text-base flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-muted-foreground" />
                    โอนเงินผ่านธนาคาร (QR Code)
                  </Label>
                </div>
                {formData.paymentMethod === "bank_transfer" && (
                  <div className="p-5 border-t bg-muted/20 flex flex-col items-center justify-center space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-white p-4 rounded-xl shadow-sm border inline-block">
                      <QrCode className="w-32 h-32 text-slate-800" />
                    </div>
                    <p className="text-sm text-center text-muted-foreground max-w-xs">
                      สแกน QR Code ด้วยแอปพลิเคชันธนาคารเพื่อชำระเงิน <br /> ยอดที่ต้องชำระ: <span className="font-semibold text-primary">{formatPrice(total)}</span>
                    </p>
                  </div>
                )}
              </div>
            </RadioGroup>
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-card p-6 space-y-6">
            <h2 className="font-semibold text-lg">สรุปคำสั่งซื้อ</h2>
            
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between gap-2 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-foreground font-medium">{item.name}</p>
                    <p className="text-muted-foreground">จำนวน: {item.quantity}</p>
                  </div>
                  <div className="font-medium text-right shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>ยอดรวมสินค้า ({itemCount} ชิ้น)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>ค่าจัดส่ง</span>
                <span>{shippingFee === 0 ? "ฟรี" : formatPrice(shippingFee)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>ยอดสุทธิ</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>

            <Button 
              size="lg" 
              className="w-full text-base py-6 font-semibold shadow-sm hover:scale-[1.02] transition-transform"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "กำลังดำเนินการ..." : "ชำระเงินและสั่งซื้อ"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute allowedRoles={["customer"]} fallbackPath="/login?redirect=/checkout">
      <CheckoutContent />
    </ProtectedRoute>
  );
}
