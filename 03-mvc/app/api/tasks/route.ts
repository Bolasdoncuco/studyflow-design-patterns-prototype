import { NextRequest, NextResponse } from "next/server";
import { TaskController } from "@/controllers/TaskController";

// GET /api/tasks -> list
export async function GET() {
  const result = TaskController.list();
  return NextResponse.json(result);
}

// POST /api/tasks -> create
export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = TaskController.create(body);
  return NextResponse.json(result, { status: result.status ?? 200 });
}
