import { NextRequest, NextResponse } from "next/server";
import { ServerNotifications, ServerAuth } from "@/lib/data/server-store";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const session = await ServerAuth.getSession(token);
  if (!session) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

  const notifications = ServerNotifications.getForSession(session.userId, session.role);
  const unreadCount = notifications.filter((n) => !n.read).length;
  return NextResponse.json({ success: true, data: notifications, unreadCount });
}

export async function PATCH(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const session = await ServerAuth.getSession(token);
  if (!session) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

  try {
    const body = await request.json();
    if (body.id) {
      const notification = ServerNotifications.markRead(body.id, session.userId, session.role);
      if (!notification) return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 });
    } else {
      ServerNotifications.markAllRead(session.userId, session.role);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}
