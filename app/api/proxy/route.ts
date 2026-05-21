import { NextRequest, NextResponse } from "next/server";
import { paystackMocks, openweathermapMocks } from "@/lib/mockData";
import { proxyRequest } from "@/lib/proxy";

const SENSITIVE_REQUEST_HEADERS = ["cookie", "set-cookie", "x-real-ip", "x-forwarded-for"];
const LIVE_COLLECTIONS = ["github", "coingecko"];

export async function POST(req: NextRequest) {
  try {
    const { url, method, headers = {}, body, collectionId, endpointId, authKey } = await req.json();

    if (!url || !method) {
      return NextResponse.json({ error: "Missing url or method" }, { status: 400 });
    }

    // Sanitise incoming headers
    const cleanHeaders: Record<string, string> = {};
    for (const [k, v] of Object.entries(headers as Record<string, string>)) {
      if (!SENSITIVE_REQUEST_HEADERS.includes(k.toLowerCase())) {
        cleanHeaders[k] = v;
      }
    }

    // Paystack mocks
    if (collectionId === "paystack" && !authKey && endpointId) {
      const mock = paystackMocks[endpointId];
      if (mock) {
        await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
        const size = new TextEncoder().encode(JSON.stringify(mock)).length;
        return NextResponse.json({
          data: mock,
          status: 200,
          responseTime: Math.floor(200 + Math.random() * 300),
          size,
          isMock: true,
        });
      }
    }

    // OpenWeatherMap mocks
    if (collectionId === "openweathermap" && !authKey && endpointId) {
      const mock = openweathermapMocks[endpointId];
      if (mock) {
        await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
        const size = new TextEncoder().encode(JSON.stringify(mock)).length;
        return NextResponse.json({
          data: mock,
          status: 200,
          responseTime: Math.floor(150 + Math.random() * 200),
          size,
          isMock: true,
        });
      }
    }

    // Add auth headers for Paystack live calls
    if (collectionId === "paystack" && authKey) {
      cleanHeaders["Authorization"] = `Bearer ${authKey}`;
    }

    // Add OpenWeatherMap key as query param (handled on URL construction in client)
    if (collectionId === "openweathermap" && authKey) {
      const separator = url.includes("?") ? "&" : "?";
      const liveUrl = `${url}${separator}appid=${authKey}`;
      const result = await proxyRequest({ url: liveUrl, method, headers: cleanHeaders, body });
      return NextResponse.json(result);
    }

    // Live call for GitHub, CoinGecko, and all custom requests
    if (LIVE_COLLECTIONS.includes(collectionId) || collectionId === "custom" || !collectionId) {
      if (collectionId === "github") {
        cleanHeaders["Accept"] = "application/vnd.github.v3+json";
      }
      const result = await proxyRequest({ url, method, headers: cleanHeaders, body });
      return NextResponse.json(result);
    }

    // Paystack live with key
    const result = await proxyRequest({ url, method, headers: cleanHeaders, body });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Proxy error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
