import { NextRequest, NextResponse } from "next/server";
import { ServerContact } from "@/lib/data/server-store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ success: false, error: "รูปแบบอีเมลไม่ถูกต้อง" }, { status: 400 });
    }

    const contactMessage = ServerContact.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    return NextResponse.json({ success: true, data: contactMessage }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}
