"use client";

import { useEffect, useState } from "react";
import { OrderStore } from "@/lib/data/store";
import type { Order } from "@/lib/data/schema";
import { formatPrice, formatShortDate, getOrderStatusLabel, getStatusColor, getPaymentMethodLabel } from "@/lib/format";
import { MapPin, User, Phone, Package } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import ProtectedRoute from "@/components/auth/protected-route";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function OrdersManagementContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const { session } = useAuth();
  
  useEffect(() => {
    loadOrders();
  }, [session]);

  const loadOrders = async () => {
    if (!session?.token) return;
    try {
      const res = await fetch("/api/orders", {
        headers: { "Authorization": `Bearer ${session.token}` }
      });
      const data = await res.json();
      if (data.success) {
        // API returns sorted? We can sort here to be sure
        const all = data.data.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(all);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (order: Order) => {
    setSelectedOrder(order);
    setUpdateStatus(order.status);
    setTrackingNumber(order.trackingNumber || "");
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !session?.token) return;
    
    if (updateStatus === "shipped" && !trackingNumber) {
      toast.error("กรุณาระบุเลขพัสดุสำหรับสถานะจัดส่งแล้ว");
      return;
    }

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.token}`
        },
        body: JSON.stringify({
          status: updateStatus,
          trackingNumber
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "อัปเดตสถานะคำสั่งซื้อสำเร็จ");
        loadOrders();
        setIsUpdateModalOpen(false);
      } else {
        toast.error(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (e) {
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  if (loading) return <div className="p-8">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">จัดการคำสั่งซื้อ</h2>
          <p className="text-muted-foreground">รายการคำสั่งซื้อทั้งหมดในระบบ</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัส</TableHead>
                <TableHead>วันที่</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>ยอดรวม</TableHead>
                <TableHead>ชำระเงิน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{formatShortDate(order.createdAt)}</TableCell>
                  <TableCell>{order.shippingAddress.name}</TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">{getPaymentMethodLabel(order.paymentMethod)}</span>
                      <Badge variant="outline" className={`${order.paymentStatus === 'paid' ? 'text-green-600 border-green-200 bg-green-50' : 'text-orange-600 border-orange-200 bg-orange-50'} text-[10px]`}>
                        {order.paymentStatus === 'paid' ? 'ชำระแล้ว' : 'รอชำระเงิน'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)} variant="outline">
                      {getOrderStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openUpdateModal(order)}>
                      อัปเดต
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    ไม่มีรายการคำสั่งซื้อ
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-lg overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              อัปเดตสถานะคำสั่งซื้อ
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">รหัส: {selectedOrder?.id}</p>
          </DialogHeader>
          
          <div className="px-6 py-4 space-y-6">
            {selectedOrder && (
              <div className="bg-muted/30 rounded-lg p-5 border shadow-sm">
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3 pb-2 border-b">
                  <MapPin className="h-4 w-4 text-primary" /> ข้อมูลจัดส่ง
                </h4>
                <div className="space-y-2.5 text-sm">
                  <p className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" /> 
                    <span><span className="font-medium text-foreground">ผู้รับ:</span> {selectedOrder.shippingAddress.name}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" /> 
                    <span><span className="font-medium text-foreground">ที่อยู่:</span> {selectedOrder.shippingAddress.address}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" /> 
                    <span><span className="font-medium text-foreground">เบอร์โทร:</span> {selectedOrder.shippingAddress.phone}</span>
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">สถานะปัจจุบัน <span className="text-destructive">*</span></Label>
                <Select value={updateStatus} onValueChange={(v) => setUpdateStatus(v || "")}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="เลือกสถานะ">
                      {updateStatus ? getOrderStatusLabel(updateStatus) : "เลือกสถานะ"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">รอดำเนินการ</SelectItem>
                    <SelectItem value="processing">กำลังจัดเตรียม</SelectItem>
                    <SelectItem value="shipped">จัดส่งแล้ว</SelectItem>
                    <SelectItem value="delivered">ส่งมอบสำเร็จ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(updateStatus === "shipped" || updateStatus === "delivered") && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label className="font-semibold">เลขพัสดุ (Tracking Number) <span className="text-destructive">*</span></Label>
                  <Input 
                    value={trackingNumber} 
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="เช่น TH123456789"
                    className="h-10"
                  />
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="m-0 px-6 py-5 border-t bg-muted/20 sm:space-x-3 rounded-b-lg">
            <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleUpdateStatus} className="gap-2">
              บันทึกการอัปเดต
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DashboardOrdersPage() {
  return (
    <ProtectedRoute allowedRoles={["staff", "manager"]}>
      <OrdersManagementContent />
    </ProtectedRoute>
  );
}
