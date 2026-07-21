"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Product, Category } from "@/lib/data/schema";
import { ProductStore, CategoryStore } from "@/lib/data/store";
import ProductCard from "@/components/products/product-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initSearch = searchParams.get("search") || "";
  const initCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(initSearch);
  const [category, setCategory] = useState(initCategory);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();
  }, []);

  // Sync URL search params with local state when navigating via Header search
  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null && q !== search) {
      setSearch(q);
    }
    const c = searchParams.get("category");
    if (c !== null && c !== category) {
      setCategory(c);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (category && category !== "all") query.append("category", category);
        if (sort) query.append("sort", sort);
        query.append("pageSize", "100"); // for now load all matching
        
        const res = await fetch(`/api/products?${query.toString()}`);
        const data = await res.json();
        
        if (data.success) {
          setProducts(data.data.items);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [search, category, sort]);

  // Update URL on filter change (basic client side only for this demo)
  useEffect(() => {
    const url = new URL(window.location.href);
    if (search) url.searchParams.set("search", search);
    else url.searchParams.delete("search");
    
    if (category !== "all") url.searchParams.set("category", category);
    else url.searchParams.delete("category");
    
    window.history.replaceState({}, "", url.toString());
  }, [search, category]);

  const filterSidebar = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>ค้นหาสินค้า</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="ชื่อสินค้า, แบรนด์..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearch("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>หมวดหมู่</Label>
        <Select value={category} onValueChange={(v) => setCategory(v || "")}>
          <SelectTrigger>
            <SelectValue placeholder="เลือกหมวดหมู่">
              {category === "all" || !category ? "ทั้งหมด" : categories.find(c => c.slug === category)?.name || "เลือกหมวดหมู่"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 sticky top-24">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2 font-semibold mb-4 pb-4 border-b">
              <SlidersHorizontal className="h-4 w-4" /> ตัวกรอง
            </div>
            {filterSidebar}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">สินค้าทั้งหมด</h1>
              <p className="text-muted-foreground">พบสินค้าทั้งหมด {products.length} รายการ</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger render={<Button variant="outline" className="md:hidden flex-1 sm:flex-none" />}>
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> ตัวกรอง
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader className="mb-4">
                    <SheetTitle>ตัวกรอง</SheetTitle>
                  </SheetHeader>
                  {filterSidebar}
                </SheetContent>
              </Sheet>

              <Select value={sort} onValueChange={(v) => setSort(v || "")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="เรียงตาม">
                    {sort === "newest" ? "มาใหม่ล่าสุด" : sort === "price_asc" ? "ราคา: ต่ำ - สูง" : sort === "price_desc" ? "ราคา: สูง - ต่ำ" : "เรียงตาม"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">มาใหม่ล่าสุด</SelectItem>
                  <SelectItem value="price_asc">ราคา: ต่ำ - สูง</SelectItem>
                  <SelectItem value="price_desc">ราคา: สูง - ต่ำ</SelectItem>
                  <SelectItem value="name">ชื่อ: A - Z</SelectItem>
                  <SelectItem value="rating">คะแนนรีวิว</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4 border rounded-xl p-4 animate-pulse">
                  <div className="bg-muted aspect-square rounded-md w-full"></div>
                  <div className="bg-muted h-4 w-2/3 rounded"></div>
                  <div className="bg-muted h-4 w-1/2 rounded"></div>
                  <div className="bg-muted h-10 w-full rounded mt-4"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-muted/10">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">ไม่พบสินค้า</h3>
              <p className="text-muted-foreground max-w-md">
                ลองปรับเปลี่ยนเงื่อนไขการค้นหา หรือดูหมวดหมู่อื่น
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => { setSearch(""); setCategory("all"); }}
              >
                ล้างตัวกรองทั้งหมด
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center mt-20">กำลังโหลด...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
