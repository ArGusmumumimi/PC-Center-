import { NextRequest, NextResponse } from "next/server";
import { ServerReviews } from "@/lib/data/server-store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ success: false, error: "productId required" }, { status: 400 });
  return NextResponse.json({ success: true, data: ServerReviews.getByProduct(productId) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const review = ServerReviews.create(body);
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}
