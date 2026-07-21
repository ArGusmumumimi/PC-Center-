"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Cpu, Monitor, MemoryStick, HardDrive, Zap, ShieldCheck, Truck } from "lucide-react";
import type { Product } from "@/lib/data/schema";
import { ProductStore } from "@/lib/data/store";
import ProductCard from "@/components/products/product-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // We can fetch from our Next.js API
        const res = await fetch("/api/products");
        const data = await res.json();
        
        if (data.success) {
          const all = data.data.items as Product[];
          const featured = all.filter(p => p.featured).slice(0, 4);
          setFeaturedProducts(featured);
          
          const latest = [...all]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 4);
          setNewProducts(latest);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };
    
    fetchProducts();
  }, []);

  const categories = [
    { name: "CPU", slug: "cpu", icon: Cpu },
    { name: "VGA", slug: "gpu", icon: Monitor },
    { name: "RAM", slug: "ram", icon: MemoryStick },
    { name: "Storage", slug: "storage", icon: HardDrive },
  ];

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-zinc-950 text-white overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="absolute h-full w-full bg-zinc-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        <div className="container relative mx-auto px-4 flex flex-col items-center text-center gap-6">
          <Badge className="bg-white/10 text-white hover:bg-white/20 border-white/20">
            เปิดตัวอย่างเป็นทางการแล้ว
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-5xl leading-tight text-balance">
            ยกระดับประสิทธิภาพ <br className="hidden md:block" /> 
            <span className="text-zinc-400 md:whitespace-nowrap">ขีดสุดแห่งคอมพิวเตอร์ของคุณ</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl text-balance">
            สัมผัสประสบการณ์ความแรงแบบไร้ขีดจำกัด กับอุปกรณ์คอมพิวเตอร์ระดับพรีเมียมคัดสรรพิเศษสำหรับเกมเมอร์และนักแต่งคอม
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <Link href="/products" className={cn(buttonVariants({ size: "lg" }), "bg-white text-black hover:bg-white/90 rounded-full px-8")}>
              เลือกซื้อสินค้าทั้งหมด
            </Link>
            <Link href="/products?category=gpu" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "bg-transparent border-white/20 hover:bg-white/10 text-white hover:text-white rounded-full px-8")}>
              ดูการ์ดจอรุ่นใหม่
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-muted/30">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">สินค้าแท้ 100%</h3>
            <p className="text-sm text-muted-foreground">รับประกันศูนย์ไทยทุกชิ้น มั่นใจได้ในคุณภาพ</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-muted/30">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">จัดส่งรวดเร็ว</h3>
            <p className="text-sm text-muted-foreground">ส่งด่วนภายใน 24 ชม. สำหรับพื้นที่กรุงเทพฯและปริมณฑล</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-muted/30">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">รับประกันยาวนาน</h3>
            <p className="text-sm text-muted-foreground">บริการหลังการขายชั้นยอด เคลมง่าย ไม่เรื่องเยอะ</p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">หมวดหมู่ยอดฮิต</h2>
          <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
            ดูทั้งหมด <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`}>
              <div className="group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border bg-card hover:border-primary/50 transition-colors">
                <cat.icon className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">สินค้าแนะนำ</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {featuredProducts.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              กำลังโหลดสินค้า...
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">มาใหม่ล่าสุด</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {newProducts.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              กำลังโหลดสินค้า...
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
