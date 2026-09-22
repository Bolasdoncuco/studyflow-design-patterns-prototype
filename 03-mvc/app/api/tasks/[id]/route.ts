import { NextRequest, NextResponse } from "next/server";
import { TaskController } from "@/controllers/TaskController";

// PATCH /api/tasks/:id -> toggle completed
export async function PATCH(_request: NextRequest, { params }: { params: { id: string } }) {
  const result = TaskController.toggle(params.id);
  return NextResponse.json(result, { status: result.status ?? 200 });
}

// DELETE /api/tasks/:id -> remove
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const result = TaskController.remove(params.id);
  return NextResponse.json(result, { status: result.status ?? 200 });
}
