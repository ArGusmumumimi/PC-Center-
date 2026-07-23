"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { UserStore } from "@/lib/data/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/protected-route";

function ProfileContent() {
  const { session } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    setMounted(true);
    if (session?.userId) {
      const user = UserStore.getById(session.userId);
      if (user) {
        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          address: user.address || ""
        });
      }
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.userId) return;
    
    setSubmitting(true);
    try {
      // 1. Update local storage mock (for client-side usage)
      const updated = UserStore.update(session.userId, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });
      
      // 2. Update server-side in-memory store via API
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        }),
      });
      
      const data = await res.json();
      
      if (updated && data.success) {
        toast.success("อัปเดตข้อมูลส่วนตัวสำเร็จ");
      } else {
        toast.error(data.error || "ไม่พบข้อมูลผู้ใช้ หรือเกิดข้อผิดพลาด");
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">ข้อมูลส่วนตัว</h1>
      
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>อีเมล (ไม่สามารถเปลี่ยนได้)</Label>
            <Input value={session?.email || ""} disabled className="bg-muted" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อ-นามสกุล</Label>
            <Input 
              id="name" name="name" 
              value={formData.name} onChange={handleChange} required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
            <Input 
              id="phone" name="phone" 
              value={formData.phone} onChange={handleChange} required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">ที่อยู่จัดส่ง</Label>
            <textarea 
              id="address" name="address" 
              value={formData.address} onChange={handleChange as any} 
              rows={4}
              className="w-full flex min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="กรอกที่อยู่สำหรับจัดส่งสินค้า..."
            />
          </div>
          
          <Button type="submit" disabled={submitting}>
            {submitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["customer", "staff", "manager"]} fallbackPath="/login?redirect=/profile">
      <ProfileContent />
    </ProtectedRoute>
  );
}
