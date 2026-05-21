import type { HttpMethod } from "@/lib/types";

interface ProxyRequest {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: string;
}

interface ProxyResult {
  data: unknown;
  status: number;
  responseTime: number;
  size: number;
}

export async function proxyRequest(req: ProxyRequest): Promise<ProxyResult> {
  const start = Date.now();

  const fetchOptions: RequestInit = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "API-Sandbox/1.0",
      ...req.headers,
    },
  };

  if (req.body && ["POST", "PUT", "PATCH"].includes(req.method)) {
    fetchOptions.body = req.body;
  }

  const response = await fetch(req.url, fetchOptions);
  const responseTime = Date.now() - start;

  const text = await response.text();
  const size = new TextEncoder().encode(text).length;

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { data, status: response.status, responseTime, size };
}
