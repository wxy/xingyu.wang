import { NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { readLatestMetricsStore, readMetricsHistory } from "@/lib/metrics/storage";

export const runtime = "nodejs";

export async function GET() {
  let testWrite = "skipped";
  let testRead = "skipped";
  try {
    const testBlob = await put("debug/test.json", JSON.stringify({ ts: Date.now() }), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    testWrite = `ok: ${testBlob.url.slice(0, 50)}...`;

    const { blobs } = await list({ prefix: "debug/test.json", limit: 1 });
    const found = blobs.find((b) => b.pathname === "debug/test.json");
    if (found?.url) {
      const headers: Record<string, string> = {};
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (token) headers["x-api-key"] = token;
      // Try store API URL first, fall back to blob URL
      const storeId = process.env.BLOB_STORE_ID || "";
      const apiUrl = storeId
        ? `https://${storeId}.blob.vercel-storage.com/debug/test.json`
        : found.url;
      const res = await fetch(apiUrl, { headers });
      testRead = res.ok ? `ok (${res.status})` : `fetch failed: ${res.status}`;
    } else {
      testRead = "not found in list";
    }
  } catch (e: any) {
    testWrite = `error: ${e.message}`;
  }

  const latest = await readLatestMetricsStore();
  const history = await readMetricsHistory("extension:hitable");

  return NextResponse.json({
    hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID || process.env.VERCEL),
    env: { BLOB_STORE_ID: !!process.env.BLOB_STORE_ID, VERCEL: !!process.env.VERCEL },
    testWrite,
    testRead,
    hasLatest: !!latest,
    productCount: Object.keys(latest?.products ?? {}).length,
    hasHistory: !!history,
    historyPoints: history?.points?.length ?? 0,
  });
}
