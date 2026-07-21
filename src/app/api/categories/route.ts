import { NextResponse } from "next/server";
import { ServerCategories, ServerAuth } from "@/lib/data/server-store";

export async function GET() {
  return NextResponse.json({ success: true, data: ServerCategories.getAll() });
}

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const session = await ServerAuth.getSession(token);
  if (!session || session.role !== "manager") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    const body = await request.json();
    const category = ServerCategories.create(body);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}
