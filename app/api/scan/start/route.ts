import { NextResponse } from "next/server";
import { startMockScan } from "@/lib/mockScanRunner";

export async function POST() {
  const snapshot = startMockScan();
  return NextResponse.json(snapshot);
}
