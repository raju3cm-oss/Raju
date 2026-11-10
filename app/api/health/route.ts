import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ app: "Avora Zone", phase: 2, status: "running" });
}
