import { NextResponse } from "next/server";
import { ServerAuth } from "@/lib/data/server-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, address } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
    }
    const result = await ServerAuth.register(name, email, password, phone, address);
    if ("error" in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
