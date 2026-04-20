import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.API_BASE_URL || "http://localhost:3001";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

function filterResponseHeaders(headers: Headers) {
  const result = new Headers();

  for (const [key, value] of headers.entries()) {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      continue;
    }
    result.set(key, value);
  }

  return result;
}

function buildTargetUrl(pathSegments: string[] | undefined, searchParams: string) {
  const base = BACKEND_URL.replace(/\/+$/, "");
  const path = pathSegments?.length ? `/${pathSegments.join("/")}` : "";
  return `${base}${path}${searchParams}`;
}

async function proxyRequest(request: NextRequest, { params }: { params: { path?: string[] } }) {
  const targetUrl = buildTargetUrl(params.path, new URL(request.url).search);
  const headers = new Headers(request.headers);
  headers.delete("host");

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
    redirect: "manual",
  });

  const body = await response.arrayBuffer();
  const responseHeaders = filterResponseHeaders(response.headers);

  return new NextResponse(body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
export const HEAD = proxyRequest;
