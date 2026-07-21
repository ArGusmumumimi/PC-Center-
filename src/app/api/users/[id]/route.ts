import { NextRequest, NextResponse } from "next/server";
import { ServerUsers, ServerAuth } from "@/lib/data/server-store";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const session = await ServerAuth.getSession(token);
  if (!session || session.role !== "manager") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  if (id === "usr_001" || id === session.userId) {
    return NextResponse.json({ success: false, error: "Cannot change status of this user" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const user = ServerUsers.updateStatus(id, body.status);
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}
