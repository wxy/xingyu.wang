import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { readMetricsHistory } from "@/lib/metrics/storage";
export const runtime = "nodejs";
export async function GET() {
  // Test 1: direct write+read cycle
  const testPath = "test-write-read.json";
  const testData = { ts: Date.now(), msg: "hello" };
  try {
    const blob = await put(testPath, JSON.stringify(testData), {
      access: "private", addRandomSuffix: false, allowOverwrite: true,
      contentType: "application/json",
    });
    // Read back via our own readBlobJson (uses x-api-key)
    const storeId = process.env.BLOB_STORE_ID || "";
    const apiUrl = `https://${storeId}.blob.vercel-storage.com/${testPath}`;
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const res = await fetch(apiUrl, {
      headers: token ? { "x-api-key": token } : {},
    });
    const testResult = res.ok ? `OK: ${await res.text()}` : `FAIL: ${res.status}`;

    const history = await readMetricsHistory("extension:hitable");
    return NextResponse.json({
      testWriteRead: testResult,
      historyPoints: history?.points?.length ?? 0,
      historyDates: history?.points?.map((p) => p.date) ?? [],
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
