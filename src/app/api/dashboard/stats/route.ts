import { NextResponse } from "next/server";
import { ServerDashboard, ServerAuth } from "@/lib/data/server-store";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const session = await ServerAuth.getSession(token);
  if (!session || (session.role !== "manager" && session.role !== "staff")) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ success: true, data: ServerDashboard.getStats() });
}
