import { NextRequest, NextResponse } from "next/server";
import { ServerOrders, ServerAuth } from "@/lib/data/server-store";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const session = await ServerAuth.getSession(token);
  if (!session) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

  const { id } = await params;
  const order = ServerOrders.getById(id);
  if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

  // Customers can only see own orders
  if (session.role === "customer" && order.userId !== session.userId) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ success: true, data: order });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const session = await ServerAuth.getSession(token);
  if (!session || (session.role !== "staff" && session.role !== "manager")) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const order = ServerOrders.updateStatus(id, body.status, body.trackingNumber);
    if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    return NextResponse.json({ 
      success: true, 
      data: order, 
      message: "อัปเดตสถานะคำสั่งซื้อและส่งการแจ้งเตือนไปยังลูกค้าเรียบร้อยแล้ว" 
    });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}
