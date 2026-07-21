"use client";

import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/data/schema";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isAuthenticated, session } = useAuth();
  
  const isCustomer = isAuthenticated && session?.role === "customer";


  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail
    if (!isCustomer) {
      toast.error("กรุณาเข้าสู่ระบบในฐานะลูกค้าเพื่อสั่งซื้อสินค้า");
      return;
    }
    addItem(product.id, 1);
    toast.success(`เพิ่ม ${product.name} ลงในตะกร้าแล้ว`);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group h-full flex flex-col">
      <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
        <CardHeader className="p-0 relative bg-white aspect-square flex items-center justify-center border-b">
          {product.featured && (
            <Badge className="absolute top-2 left-2 z-10 bg-black text-white hover:bg-black/80">
              แนะนำ
            </Badge>
          )}

          {product.images?.[0] && product.images[0] !== "/products/placeholder.jpg" ? (
            <div className="w-full h-full relative transition-transform duration-500 group-hover:scale-110">
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                className="object-contain p-4" 
                unoptimized 
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted/80 to-muted/30 flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-110">
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl font-black text-foreground/20 select-none uppercase tracking-widest text-center">
                  {product.brand}
                </div>
                <div className="text-xs font-semibold text-foreground/30 uppercase tracking-widest bg-background/50 px-3 py-1 rounded-full backdrop-blur-sm">
                  {product.category.replace('_', ' ')}
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2">
            <p className="text-xs text-muted-foreground uppercase font-medium">{product.brand}</p>
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{product.rating}</span>
              <span className="text-muted-foreground">({product.reviewCount})</span>
            </div>
          </div>
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="mt-auto pt-4 flex flex-col">

            <span className="text-lg font-bold">
              {formatPrice(product.price)}
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t-0 bg-transparent">
          <Button 
            className="w-full gap-2 h-10 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            variant={product.stock === 0 ? "outline" : "default"}
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            {product.stock === 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
