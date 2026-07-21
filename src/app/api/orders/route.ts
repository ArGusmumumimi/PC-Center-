import { NextRequest, NextResponse } from "next/server";
import { ServerOrders, ServerAuth } from "@/lib/data/server-store";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const session = await ServerAuth.getSession(token);
  if (!session) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

  let orders;
  if (session.role === "staff" || session.role === "manager") {
    orders = ServerOrders.getAll();
  } else {
    orders = ServerOrders.getByUser(session.userId);
  }
  return NextResponse.json({ success: true, data: orders });
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const session = await ServerAuth.getSession(token);
  if (!session) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

  try {
    const body = await request.json();
    const order = ServerOrders.create({ ...body, userId: session.userId });
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}
