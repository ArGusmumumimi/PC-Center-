import { NextRequest, NextResponse } from "next/server";
import { ServerProducts, ServerAuth } from "@/lib/data/server-store";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = ServerProducts.getById(id) || ServerProducts.getBySlug(id);
  if (!product) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: product });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const session = await ServerAuth.getSession(token);
  if (!session || session.role !== "manager") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  try {
    const body = await request.json();
    const product = ServerProducts.update(id, body);
    if (!product) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const session = await ServerAuth.getSession(token);
  if (!session || session.role !== "manager") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const deleted = ServerProducts.delete(id);
  if (!deleted) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
  return NextResponse.json({ success: true, message: "Product deleted" });
}
