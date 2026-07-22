"use client";

import { useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

function ContactDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("ส่งข้อความถึงเราเรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็วที่สุด");
        setName("");
        setEmail("");
        setMessage("");
        setOpen(false);
      } else {
        toast.error(data.error || "ส่งข้อความไม่สำเร็จ");
      }
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-left hover:text-foreground transition-colors underline-offset-2 hover:underline">
        📧 support@pccenter.com
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ติดต่อเรา</DialogTitle>
          <DialogDescription>
            กรอกแบบฟอร์มด้านล่าง ทีมงานจะติดต่อกลับทางอีเมลของคุณ
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">ชื่อ</Label>
            <Input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">อีเมล</Label>
            <Input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-message">ข้อความ</Label>
            <Textarea id="contact-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "กำลังส่ง..." : "ส่งข้อความ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-black">
                PC
              </div>
              PC Center
            </div>
            <p className="text-sm text-muted-foreground">
              ศูนย์รวมอุปกรณ์คอมพิวเตอร์คุณภาพสูง ราคาดีที่สุด พร้อมบริการจัดส่งทั่วประเทศ
            </p>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold">หมวดหมู่สินค้า</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/products?category=cpu" className="hover:text-foreground transition-colors">โปรเซสเซอร์ (CPU)</Link>
              <Link href="/products?category=gpu" className="hover:text-foreground transition-colors">กราฟิกการ์ด (GPU)</Link>
              <Link href="/products?category=ram" className="hover:text-foreground transition-colors">แรม (RAM)</Link>
              <Link href="/products?category=storage" className="hover:text-foreground transition-colors">SSD / HDD</Link>
              <Link href="/products?category=monitor" className="hover:text-foreground transition-colors">จอมอนิเตอร์</Link>
            </nav>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h3 className="font-semibold">ช่วยเหลือ</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">วิธีการสั่งซื้อ</Link>
              <Link href="#" className="hover:text-foreground transition-colors">การชำระเงิน</Link>
              <Link href="#" className="hover:text-foreground transition-colors">การจัดส่ง</Link>
              <Link href="#" className="hover:text-foreground transition-colors">นโยบายคืนสินค้า</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">ติดต่อเรา</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>📍 99 ถ.รัชดาภิเษก กรุงเทพฯ 10400</p>
              <p>📞 02-123-4567</p>
              <ContactDialog />
              <p>🕐 จ-ศ 9:00-18:00 น.</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2025 PC Center. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">นโยบายความเป็นส่วนตัว</Link>
            <Link href="#" className="hover:text-foreground transition-colors">ข้อกำหนดการใช้งาน</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
