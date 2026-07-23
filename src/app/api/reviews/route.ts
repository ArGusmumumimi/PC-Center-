import { NextRequest, NextResponse } from "next/server";
import { ServerReviews, ServerAuth, ServerOrders } from "@/lib/data/server-store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ success: false, error: "productId required" }, { status: 400 });
  return NextResponse.json({ success: true, data: ServerReviews.getByProduct(productId) });
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const session = await ServerAuth.getSession(token);
  if (!session) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
  if (session.role !== "customer") {
    return NextResponse.json({ success: false, error: "เฉพาะลูกค้าเท่านั้นที่สามารถเขียนรีวิวได้" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { productId, rating, comment } = body;
    if (!productId || typeof rating !== "number" || rating < 1 || rating > 5 || !comment?.trim()) {
      return NextResponse.json({ success: false, error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    const userOrders = ServerOrders.getByUser(session.userId);
    const hasPurchased = userOrders.some(order => 
      order.items.some(item => item.productId === productId)
    );

    if (!hasPurchased) {
      return NextResponse.json({ success: false, error: "คุณต้องสั่งซื้อสินค้านี้ก่อนจึงจะสามารถเขียนรีวิวได้" }, { status: 403 });
    }

    const user = await ServerAuth.getUserByToken(token);
    if (!user) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    const review = ServerReviews.create({
      productId,
      rating,
      comment: comment.trim(),
      userId: session.userId,
      userName: user.name,
    });
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}
