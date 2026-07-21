"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Star, ShoppingCart, ShieldCheck, Truck, ChevronRight, 
  Minus, Plus
} from "lucide-react";
import type { Product, Review } from "@/lib/data/schema";
import { ProductStore, ReviewStore } from "@/lib/data/store";
import { formatPrice, formatShortDate } from "@/lib/format";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Image from "next/image";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const { addItem } = useCart();
  const { isAuthenticated, session } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const isCustomer = isAuthenticated && session?.role === "customer";

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (slug) {
        try {
          const res = await fetch(`/api/products/${slug}`);
          const data = await res.json();
          if (data.success) {
            setProduct(data.data);
            
            // For reviews, we can fetch from API if we have an endpoint, 
            // but since we haven't created /api/reviews yet, 
            // I'll keep ReviewStore.getByProductId for reviews for now, 
            // or I can create a reviews API later. Actually, the assignment focuses on product, order, users.
            // Let's use local storage for reviews just so it doesn't break.
            setReviews(ReviewStore.getByProductId(data.data.id));
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProductAndReviews();
  }, [slug]);

  if (loading) {
    return <div className="container py-24 text-center">กำลังโหลดข้อมูลสินค้า...</div>;
  }

  if (!product) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">ไม่พบสินค้า</h2>
        <Button onClick={() => router.push("/products")}>กลับไปดูสินค้าทั้งหมด</Button>
      </div>
    );
  }


  const handleAddToCart = () => {
    if (!isCustomer) {
      toast.error("กรุณาเข้าสู่ระบบในฐานะลูกค้าเพื่อสั่งซื้อสินค้า");
      router.push("/login");
      return;
    }
    addItem(product.id, quantity);
    toast.success(`เพิ่ม ${product.name} จำนวน ${quantity} ชิ้น ลงในตะกร้าแล้ว`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">หน้าแรก</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-foreground">สินค้า</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/products?category=${product.category}`} className="hover:text-foreground uppercase">
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        {/* Product Image */}
        <div className="bg-white rounded-2xl border aspect-square flex flex-col items-center justify-center p-12 relative overflow-hidden">

          {product.featured && (
            <Badge className="absolute top-4 left-4 bg-black text-white text-base px-3 py-1 hover:bg-black/80">
              สินค้าแนะนำ
            </Badge>
          )}
          
          {product.images?.[0] && product.images[0] !== "/products/placeholder.jpg" ? (
            <div className="relative w-full h-full">
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                className="object-contain p-8" 
                unoptimized 
              />
            </div>
          ) : (
            <div className="text-6xl md:text-8xl font-black text-muted/20 select-none uppercase tracking-widest text-center">
              {product.brand}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2 text-sm font-semibold text-primary uppercase tracking-wider">
            {product.brand}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-5 w-5 ${star <= Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} 
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <Separator orientation="vertical" className="h-4" />
            <Link href="#reviews" className="text-sm text-muted-foreground hover:text-primary">
              {product.reviewCount} รีวิว
            </Link>
          </div>

          <div className="mb-8">

            <div className="text-4xl font-black text-primary">
              {formatPrice(product.price)}
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium w-24">สถานะ:</span>
              {product.stock > 0 ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                  มีสินค้า ({product.stock} ชิ้น)
                </Badge>
              ) : (
                <Badge variant="destructive">สินค้าหมด</Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {product.stock > 0 && (
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-12 text-center font-medium">{quantity}</div>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button 
              size="lg" 
              className="flex-1 text-lg" 
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock === 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 py-6 border-y border-dashed">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <div className="font-semibold">รับประกันแท้</div>
                <div className="text-muted-foreground">จากศูนย์ไทย 100%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <div className="font-semibold">ส่งฟรีทั่วไทย</div>
                <div className="text-muted-foreground">เมื่อสั่งซื้อ 5,000+</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="mb-24">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 text-base">
            รายละเอียดสินค้า
          </TabsTrigger>
          <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 text-base">
            สเปค (Specifications)
          </TabsTrigger>
          <TabsTrigger value="reviews" id="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 text-base">
            รีวิว ({reviews.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="pt-6">
          <div className="prose prose-sm md:prose-base max-w-4xl dark:prose-invert">
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="specs" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex border-b pb-3">
                <div className="w-1/3 font-medium text-muted-foreground uppercase text-sm">
                  {key.replace(/_/g, " ")}
                </div>
                <div className="w-2/3">{value}</div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="pt-6">
          {reviews.length > 0 ? (
            <div className="space-y-6 max-w-4xl">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-6 bg-muted/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-semibold">{review.userName}</div>
                      <div className="text-xs text-muted-foreground">{formatShortDate(review.createdAt)}</div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border rounded-lg border-dashed">
              <p className="text-muted-foreground">ยังไม่มีรีวิวสำหรับสินค้านี้</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
