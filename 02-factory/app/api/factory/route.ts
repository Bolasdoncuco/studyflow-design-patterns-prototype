import { NextRequest, NextResponse } from "next/server";
import { NotifierFactory, NotificationType } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, to, message } = body as {
    type: NotificationType;
    to: string;
    message: string;
  };

  try {
    // The client does NOT know (or care) which concrete class is created.
    const notifier = NotifierFactory.create(type);
    const result = notifier.send(to, message);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 400 });
  }
}
