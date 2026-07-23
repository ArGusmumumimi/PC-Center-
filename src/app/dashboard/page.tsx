"use client";

import useSWR from "swr";
import { useAuth } from "@/contexts/auth-context";
import { formatPrice } from "@/lib/format";
import ProtectedRoute from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, ShoppingBag, Package, Users, 
  ArrowUpRight, AlertCircle, Clock, Loader2
} from "lucide-react";

function DashboardContent() {
  const { session } = useAuth();
  
  const fetcher = (url: string) => fetch(url, {
    headers: { Authorization: `Bearer ${session?.token}` }
  }).then(res => res.json()).then(data => data.data);

  const { data: stats, error } = useSWR(session ? '/api/dashboard/stats' : null, fetcher, {
    refreshInterval: 3000,
  });

  if (error) return <div className="p-8 text-destructive">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>;
  if (!stats) return <div className="p-8 flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> กำลังโหลดข้อมูล...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">ภาพรวมระบบ</h2>
        <p className="text-muted-foreground">ยินดีต้อนรับกลับมา, {session?.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยอดขายรวม</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">คำสั่งซื้อทั้งหมด</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1 text-yellow-600 flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {stats.pendingOrders} รอดำเนินการ
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สินค้าในระบบ</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1 text-red-600 flex items-center">
              <AlertCircle className="mr-1 h-3 w-3" />
              {stats.lowStockProducts} รายการใกล้หมด
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ลูกค้าทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>สถานะคำสั่งซื้อ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md border-dashed bg-muted/20">
              {/* This would be a chart in a real app */}
              <div className="text-center space-y-4 w-full px-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">รอดำเนินการ (Pending)</span>
                  <span className="font-medium">{stats.ordersByStatus.pending}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">กำลังจัดเตรียม (Processing)</span>
                  <span className="font-medium">{stats.ordersByStatus.processing}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">จัดส่งแล้ว (Shipped)</span>
                  <span className="font-medium">{stats.ordersByStatus.shipped}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">ส่งมอบสำเร็จ (Delivered)</span>
                  <span className="font-medium">{stats.ordersByStatus.delivered}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>สินค้ายอดนิยม 5 อันดับแรก</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.topProducts.map((product: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex flex-col min-w-0 pr-4">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">ขายได้ {product.sales} ชิ้น</p>
                  </div>
                  <div className="font-medium shrink-0">{formatPrice(product.revenue)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
