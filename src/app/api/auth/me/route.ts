import { NextResponse } from "next/server";
import { ServerAuth } from "@/lib/data/server-store";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const user = await ServerAuth.getUserByToken(token);
  if (!user) {
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: user });
}
