import { NextRequest, NextResponse } from "next/server";
import { DatabaseConnection } from "@/lib/DatabaseConnection";

// Every time a request comes in, we ask for the instance via
// getInstance(). If the pattern is implemented correctly,
// connectionId NEVER changes between calls (as long as the server
// keeps running).
export async function GET(request: NextRequest) {
  const db = DatabaseConnection.getInstance();
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") ?? "SELECT * FROM students";

  const result = db.runQuery(query);
  const stats = db.getStats();

  return NextResponse.json({
    message: "Query executed using the SAME connection instance",
    result,
    stats,
  });
}
