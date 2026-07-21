import Link from "next/link";
import { Separator } from "@/components/ui/separator";

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
              <p>📧 support@pccenter.com</p>
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
