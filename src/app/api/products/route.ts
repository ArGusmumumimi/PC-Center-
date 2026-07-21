import { NextRequest, NextResponse } from "next/server";
import { ServerProducts } from "@/lib/data/server-store";
import { ServerAuth } from "@/lib/data/server-store";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const result = ServerProducts.getAll({
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    brand: searchParams.get("brand") || undefined,
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 12,
    sort: searchParams.get("sort") || undefined,
  });
  return NextResponse.json({ success: true, data: result });
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const session = await ServerAuth.getSession(token);
  if (!session || session.role !== "manager") {
    return NextResponse.json({ success: false, error: "Forbidden — Manager only" }, { status: 403 });
  }
  try {
    const body = await request.json();
    const product = ServerProducts.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}
