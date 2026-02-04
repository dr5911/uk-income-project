import { NextResponse } from "next/server";
import { getProgressManager } from "@/lib/progressManager";

export function GET() {
  const progressManager = getProgressManager();
  return NextResponse.json(progressManager.getSnapshot());
}
