import { NextResponse } from "next/server";
import { ServerAuth } from "@/lib/data/server-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "กรุณากรอกอีเมลและรหัสผ่าน" }, { status: 400 });
    }
    const result = await ServerAuth.login(email, password);
    if ("error" in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 });
    }
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
