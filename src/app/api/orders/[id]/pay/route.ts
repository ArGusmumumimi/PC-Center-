import { NextRequest, NextResponse } from "next/server";
import { ServerOrders, ServerAuth } from "@/lib/data/server-store";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const session = await ServerAuth.getSession(token);
  if (!session) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
  if (session.role !== "customer") {
    return NextResponse.json({ success: false, error: "เฉพาะลูกค้าเท่านั้นที่สามารถชำระเงินได้" }, { status: 403 });
  }

  const { id } = await params;
  const result = ServerOrders.pay(id, session.userId);
  if ("error" in result) {
    const status = result.error === "Forbidden" ? 403 : 400;
    return NextResponse.json({ success: false, error: result.error }, { status });
  }
  return NextResponse.json({ success: true, data: result.data, message: "ชำระเงินสำเร็จ" });
}
