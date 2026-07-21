"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (!isLoading && isAuthenticated) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }
    
    setSubmitting(true);
    
    const result = await register(
      formData.name, 
      formData.email, 
      formData.password, 
      formData.phone, 
      formData.address
    );
    
    if (result.success) {
      toast.success("สมัครสมาชิกสำเร็จ ยินดีต้อนรับ!");
      router.push("/");
    } else {
      toast.error(result.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground hover:text-foreground")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> กลับหน้าแรก
          </Link>
        </div>
        
        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xl font-black mb-4">
              PC
            </div>
            <h1 className="text-2xl font-bold tracking-tight">สมัครสมาชิก</h1>
            <p className="text-sm text-muted-foreground mt-2">
              สร้างบัญชีใหม่เพื่อประสบการณ์ช้อปปิ้งที่ดียิ่งขึ้น
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                <Input 
                  id="name" name="name" 
                  value={formData.name} onChange={handleChange} required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input 
                  id="email" name="email" type="email" 
                  value={formData.email} onChange={handleChange} required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input 
                  id="password" name="password" type="password" 
                  value={formData.password} onChange={handleChange} required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                <Input 
                  id="confirmPassword" name="confirmPassword" type="password" 
                  value={formData.confirmPassword} onChange={handleChange} required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
              <Input 
                id="phone" name="phone" 
                value={formData.phone} onChange={handleChange} required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">ที่อยู่จัดส่ง (สามารถเพิ่มภายหลังได้)</Label>
              <textarea 
                id="address" name="address" 
                value={formData.address} onChange={handleChange as any} 
                rows={3}
                className="w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            
            <Button type="submit" className="w-full mt-6" disabled={submitting}>
              {submitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">มีบัญชีผู้ใช้อยู่แล้ว? </span>
            <Link href="/login" className="text-primary font-medium hover:underline">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
