"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/data/schema";
import { useAuth } from "@/contexts/auth-context";
import { Loader2, Mail, Phone, MapPin, Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function CustomersPage() {
  const { session } = useAuth();
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCustomers() {
      if (!session) return;
      try {
        const res = await fetch("/api/users", {
          headers: { Authorization: `Bearer ${session.token}` }
        });
        const data = await res.json();
        if (data.success) {
          // Filter only customers
          setCustomers(data.data.filter((u: User) => u.role === "customer"));
        }
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, [session]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">ข้อมูลลูกค้า</h2>
        <p className="text-muted-foreground mt-2">ดูรายชื่อและข้อมูลการติดต่อของลูกค้า (Read-only)</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>รายชื่อลูกค้าทั้งหมด ({customers.length})</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ค้นหาชื่อลูกค้า..."
              className="pl-8 bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อลูกค้า</TableHead>
                  <TableHead>อีเมล</TableHead>
                  <TableHead>เบอร์โทรศัพท์</TableHead>
                  <TableHead>ที่อยู่</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right w-[100px]">รายละเอียด</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      {searchQuery ? "ไม่พบข้อมูลลูกค้าที่ค้นหา" : "ไม่พบข้อมูลลูกค้า"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {customer.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {customer.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {customer.phone}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {customer.address ? (
                          <div className="flex items-start gap-2 max-w-xs">
                            <MapPin className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                            <span className="truncate">{customer.address}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.status === "inactive" ? "destructive" : "outline"} className={customer.status === "inactive" ? "" : "bg-green-50 text-green-700 hover:bg-green-50"}>
                          {customer.status === "inactive" ? "ระงับการใช้งาน" : "ใช้งาน"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger className={buttonVariants({ variant: "ghost", size: "sm" })}>
                            <Eye className="h-4 w-4 mr-1" /> ดูข้อมูล
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>ข้อมูลลูกค้า</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label className="text-muted-foreground">ชื่อ - นามสกุล</Label>
                                <div className="font-medium">{customer.name}</div>
                              </div>
                              <div className="grid gap-2">
                                <Label className="text-muted-foreground">อีเมล</Label>
                                <div className="font-medium flex items-center gap-2"><Mail className="h-4 w-4" />{customer.email}</div>
                              </div>
                              <div className="grid gap-2">
                                <Label className="text-muted-foreground">เบอร์โทรศัพท์</Label>
                                <div className="font-medium flex items-center gap-2"><Phone className="h-4 w-4" />{customer.phone || "-"}</div>
                              </div>
                              <div className="grid gap-2">
                                <Label className="text-muted-foreground">ที่อยู่จัดส่ง</Label>
                                <div className="font-medium flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />{customer.address || "-"}</div>
                              </div>
                              <div className="grid gap-2">
                                <Label className="text-muted-foreground">สถานะบัญชี</Label>
                                <div>
                                  <Badge variant={customer.status === "inactive" ? "destructive" : "default"} className={customer.status === "inactive" ? "" : "bg-green-500"}>
                                    {customer.status === "inactive" ? "ระงับการใช้งาน" : "ใช้งาน"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
