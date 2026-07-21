"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { canAccessDashboard } from "@/lib/rbac";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  
  const { login, isLoading, isAuthenticated, session } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (!isLoading && isAuthenticated && session) {
      if (canAccessDashboard(session.role) && redirectPath === "/") {
        router.replace(session.role === "manager" ? "/dashboard" : "/dashboard/orders");
      } else {
        router.replace(redirectPath);
      }
    }
  }, [isLoading, isAuthenticated, session, redirectPath, router]);

  if (!isLoading && isAuthenticated && session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const result = await login(email, password);
    if (result.success) {
      toast.success("เข้าสู่ระบบสำเร็จ");
      const authData = localStorage.getItem("pc_center_auth_session");
      if (authData) {
        const sessionData = JSON.parse(authData);
        if (canAccessDashboard(sessionData.role) && redirectPath === "/") {
          router.push(sessionData.role === "manager" ? "/dashboard" : "/dashboard/orders");
        } else {
          router.push(redirectPath);
        }
      }
    } else {
      toast.error(result.error || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
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
            <h1 className="text-2xl font-bold tracking-tight">เข้าสู่ระบบ</h1>
            <p className="text-sm text-muted-foreground mt-2">
              เข้าสู่ระบบเพื่อจัดการคำสั่งซื้อของคุณ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  ลืมรหัสผ่าน?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <Button type="submit" className="w-full mt-6" disabled={submitting}>
              {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">ยังไม่มีบัญชีผู้ใช้? </span>
            <Link href="/register" className="text-primary font-medium hover:underline">
              สมัครสมาชิก
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t text-xs text-muted-foreground">
            <p className="font-semibold mb-2">บัญชีสำหรับทดสอบ:</p>
            <ul className="space-y-1">
              <li>Manager: <span className="font-mono">admin@pccenter.com / admin123</span></li>
              <li>Staff: <span className="font-mono">staff@pccenter.com / staff123</span></li>
              <li>Customer: <span className="font-mono">customer@pccenter.com / customer123</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>}>
      <LoginContent />
    </Suspense>
  );
}
