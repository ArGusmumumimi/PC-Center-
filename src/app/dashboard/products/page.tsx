"use client";

import { useEffect, useState } from "react";
import { ProductStore, CategoryStore, generateId } from "@/lib/data/store";
import type { Product, Category } from "@/lib/data/schema";
import { formatPrice } from "@/lib/format";
import { useAuth } from "@/contexts/auth-context";
import ProtectedRoute from "@/components/auth/protected-route";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Package, DollarSign, Tags, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

function ProductsManagementContent() {
  const { session } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    comparePrice: "",
    stock: "",
    status: "active",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?page=${page}&pageSize=10`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.items);
        setTotalPages(data.data.totalPages || 1);
        setTotalItems(data.data.total || 0);
      }

      const catRes = await fetch("/api/categories");
      const catData = await catRes.json();
      if (catData.success) {
        setCategories(catData.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price.toString(),
        comparePrice: product.comparePrice.toString(),
        stock: product.stock.toString(),
        status: product.status,
        description: product.description,
      });
      setImagePreview(product.images?.[0] || null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        brand: "",
        category: categories.length > 0 ? categories[0].slug : "",
        price: "",
        comparePrice: "",
        stock: "0",
        status: "active",
        description: "",
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.price) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    if (!session?.token) {
      toast.error("เซสชันหมดอายุ");
      return;
    }

    const baseData = {
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      brand: formData.brand,
      category: formData.category,
      price: Number(formData.price),
      comparePrice: Number(formData.comparePrice) || Number(formData.price),
      stock: Number(formData.stock),
      status: Number(formData.stock) === 0 ? "out_of_stock" : Number(formData.stock) < 5 ? "low_stock" : "active",
      description: formData.description,
      images: imagePreview ? [imagePreview] : (editingProduct?.images || ["/products/placeholder.jpg"]),
      specs: editingProduct?.specs || {},
      rating: editingProduct?.rating || 0,
      reviewCount: editingProduct?.reviewCount || 0,
      featured: editingProduct?.featured || false,
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.token}`
          },
          body: JSON.stringify(baseData)
        });
        const data = await res.json();
        if (data.success) {
          toast.success("บันทึกการแก้ไขสำเร็จ");
        } else {
          toast.error(data.error || "เกิดข้อผิดพลาด");
        }
      } else {
        const res = await fetch(`/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.token}`
          },
          body: JSON.stringify({ ...baseData, id: `prod_${Date.now()}`, createdAt: new Date().toISOString() })
        });
        const data = await res.json();
        if (data.success) {
          toast.success("เพิ่มสินค้าใหม่สำเร็จ");
        } else {
          toast.error(data.error || "เกิดข้อผิดพลาด");
        }
      }
      setIsModalOpen(false);
      loadData();
    } catch (e) {
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("ยืนยันการลบสินค้านี้?")) {
      if (!session?.token) return;
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${session.token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          toast.success("ลบสินค้าสำเร็จ");
          loadData();
        } else {
          toast.error(data.error || "เกิดข้อผิดพลาด");
        }
      } catch (e) {
        toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      }
    }
  };

  if (loading && products.length === 0) return <div className="p-8">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">จัดการสินค้า</h2>
          <p className="text-muted-foreground">รวมทั้งหมด {totalItems} รายการ</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> เพิ่มสินค้าใหม่
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>สินค้า</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead>สต็อก</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground uppercase">{product.brand}</div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    {product.stock === 0 ? (
                      <span className="text-destructive font-medium">{product.stock}</span>
                    ) : product.stock < 5 ? (
                      <span className="text-amber-500 font-medium">{product.stock}</span>
                    ) : (
                      <span>{product.stock}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={product.status === "active" ? "default" : product.status === "out_of_stock" ? "destructive" : "secondary"}
                      className={product.status === "low_stock" ? "bg-amber-500 hover:bg-amber-600 text-white border-transparent" : ""}
                    >
                      {product.status === "active" ? "พร้อมขาย" : product.status === "low_stock" ? "ใกล้หมด" : product.status === "out_of_stock" ? "หมด" : product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button 
            variant="outline" 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ก่อนหน้า
          </Button>
          <span className="text-sm">
            หน้า {page} จาก {totalPages}
          </span>
          <Button 
            variant="outline" 
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            ถัดไป
          </Button>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl overflow-hidden p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold">
              {editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
            {/* Left Column: Details & Pricing */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="font-semibold">ชื่อสินค้า <span className="text-destructive">*</span></Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="ระบุชื่อสินค้า..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">แบรนด์</Label>
                  <Input value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} placeholder="ระบุแบรนด์สินค้า..." />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">หมวดหมู่ <span className="text-destructive">*</span></Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v || ""})}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่">
                        {formData.category ? categories.find(c => c.slug === formData.category)?.name : "เลือกหมวดหมู่"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">ราคา (บาท) <span className="text-destructive">*</span></Label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">สต็อก <span className="text-destructive">*</span></Label>
                  <Input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} placeholder="0" />
                </div>
              </div>


            </div>

            {/* Right Column: Image & Description */}
            <div className="flex flex-col h-full space-y-5">
              <div className="space-y-2">
                <Label className="font-semibold">รูปภาพสินค้า</Label>
                <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary/50 transition-colors">
                  {imagePreview ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
                      <Image src={imagePreview} alt="Preview" fill className="object-contain" unoptimized />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:bg-destructive/90 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 p-6 cursor-pointer">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <ImagePlus className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">คลิกเพื่ออัปโหลดรูปภาพ</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP (สูงสุด 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <Label className="font-semibold mb-2">รายละเอียดสินค้า</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="เพิ่มคำอธิบายรายละเอียดของสินค้า..."
                  className="flex-1 min-h-[120px] resize-none"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-4 bg-transparent border-t-0 p-0 m-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave} className="min-w-[120px]">บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DashboardProductsPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ProductsManagementContent />
    </ProtectedRoute>
  );
}
