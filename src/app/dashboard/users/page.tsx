"use client";

import { useEffect, useState } from "react";
import { UserStore } from "@/lib/data/store";
import type { User } from "@/lib/data/schema";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatShortDate } from "@/lib/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getRoleLabel, getRoleBadgeVariant } from "@/lib/rbac";
import { Users, Shield, Briefcase, User as UserIcon, Search, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

function UsersManagementContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "staff" });

  const { session } = useAuth();
  
  useEffect(() => {
    loadUsers();
  }, [session]);

  const loadUsers = async () => {
    if (!session?.token) return;
    try {
      const res = await fetch("/api/users", {
        headers: { "Authorization": `Bearer ${session.token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    if (!session?.token) return;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("เปลี่ยนสถานะผู้ใช้สำเร็จ");
        loadUsers();
      } else {
        toast.error(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (e) {
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.token) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("เพิ่มผู้ใช้งานใหม่สำเร็จ");
        setIsAddModalOpen(false);
        setFormData({ name: "", email: "", password: "", role: "staff" });
        loadUsers();
      } else {
        toast.error(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (e) {
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">กำลังโหลดข้อมูล...</div>;

  const renderTable = (baseUsers: User[]) => {
    const finalFilteredUsers = baseUsers.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสผู้ใช้</TableHead>
              <TableHead>ชื่อ - นามสกุล</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>วันที่สมัคร</TableHead>
              <TableHead>บทบาทปัจจุบัน</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right w-[150px]">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {finalFilteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "ไม่พบผู้ใช้งานที่ค้นหา" : "ไม่พบผู้ใช้งานในกลุ่มนี้"}
                </TableCell>
              </TableRow>
            ) : finalFilteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-xs">{user.id}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatShortDate(user.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === "inactive" ? "destructive" : "default"} className={user.status === "inactive" ? "" : "bg-green-500 hover:bg-green-600"}>
                    {user.status === "inactive" ? "ระงับการใช้งาน" : "ใช้งาน"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {/* Don't allow changing admin role to prevent lockout */}
                  {user.email !== "admin@pccenter.com" && user.id !== session?.userId ? (
                    <Select 
                      value={user.status || "active"} 
                      onValueChange={(val) => handleStatusChange(user.id, val || "active")}
                    >
                      <SelectTrigger className="h-8 w-[140px] ml-auto">
                        <SelectValue placeholder="เลือกสถานะ">
                          {(user.status || "active") === "active" ? "ใช้งาน" : "ระงับการใช้งาน"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">ใช้งาน</SelectItem>
                        <SelectItem value="inactive">ระงับการใช้งาน</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-xs text-muted-foreground block py-2">ห้ามแก้ไข</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">จัดการผู้ใช้งาน</h2>
          <p className="text-muted-foreground">รายชื่อบัญชีผู้ใช้ทั้งหมดในระบบ ({users.length} บัญชี)</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
          <div className="relative w-full sm:min-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ค้นหารหัสผู้ใช้ หรือ ชื่อ-นามสกุล..."
              className="pl-8 bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger className={buttonVariants()}>
              <Plus className="h-4 w-4 mr-2" /> เพิ่มผู้ใช้ใหม่
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>เพิ่มผู้ใช้ใหม่</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>ชื่อ - นามสกุล <span className="text-destructive">*</span></Label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="ระบุชื่อผู้ใช้" />
                </div>
                <div className="space-y-2">
                  <Label>อีเมล <span className="text-destructive">*</span></Label>
                  <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="example@email.com" />
                </div>
                <div className="space-y-2">
                  <Label>รหัสผ่าน <span className="text-destructive">*</span></Label>
                  <Input type="password" required minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="อย่างน้อย 6 ตัวอักษร" />
                </div>
                <div className="space-y-2">
                  <Label>บทบาท <span className="text-destructive">*</span></Label>
                  <Select value={formData.role} onValueChange={v => setFormData({...formData, role: v || "staff"})}>
                    <SelectTrigger>
                      <SelectValue>
                        {formData.role === "staff" ? "พนักงาน" : formData.role === "manager" ? "ผู้จัดการ" : "ลูกค้า"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">พนักงาน</SelectItem>
                      <SelectItem value="manager">ผู้จัดการ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>ยกเลิก</Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "กำลังบันทึก..." : "บันทึก"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4 gap-2 bg-transparent p-0">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 rounded-xl py-2.5 px-4 md:px-6">
            <Users className="w-4 h-4 mr-2" /> ทั้งหมด
          </TabsTrigger>
          <TabsTrigger value="manager" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 rounded-xl py-2.5 px-4 md:px-6">
            <Shield className="w-4 h-4 mr-2" /> ผู้จัดการ
          </TabsTrigger>
          <TabsTrigger value="staff" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 rounded-xl py-2.5 px-4 md:px-6">
            <Briefcase className="w-4 h-4 mr-2" /> พนักงาน
          </TabsTrigger>
          <TabsTrigger value="customer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50 rounded-xl py-2.5 px-4 md:px-6">
            <UserIcon className="w-4 h-4 mr-2" /> ลูกค้า
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">{renderTable(users)}</TabsContent>
        <TabsContent value="manager">{renderTable(users.filter(u => u.role === "manager"))}</TabsContent>
        <TabsContent value="staff">{renderTable(users.filter(u => u.role === "staff"))}</TabsContent>
        <TabsContent value="customer">{renderTable(users.filter(u => u.role === "customer"))}</TabsContent>
      </Tabs>
    </div>
  );
}

export default function DashboardUsersPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <UsersManagementContent />
    </ProtectedRoute>
  );
}
