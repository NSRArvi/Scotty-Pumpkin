import { NextResponse } from "next/server";

function joinUrl(base, path) {
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function pickToken(payload) {
  if (!payload || typeof payload !== "object") return "";

  const direct = payload.token;

  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const nested = payload.data || payload.result || payload.user || {};
  const nestedToken = nested.token;

  return typeof nestedToken === "string" ? nestedToken.trim() : "";
}

export async function POST(request) {
  const rootApi = process.env.NEXT_ROOT_API;
  const loginPath = "/spump/sale/auth/admin";

  if (!rootApi) {
    return NextResponse.json(
      { message: "NEXT_ROOT_API is not configured." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const userName = String(body?.userName || "").trim();
    const password = String(body?.password || "").trim();

    if (!userName || !password) {
      return NextResponse.json(
        { message: "Username and password are required." },
        { status: 400 },
      );
    }

    const endpoint = joinUrl(rootApi, loginPath);
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password }),
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") || "";
    let payload = {};

    if (contentType.includes("application/json")) {
      payload = await upstream.json();
    } else {
      const text = await upstream.text();
      payload = { message: text };
    }

    if (!upstream.ok) {
      const message =
        payload?.message || payload?.error || "Invalid credentials.";
      return NextResponse.json({ message }, { status: upstream.status });
    }

    const authToken = pickToken(payload);
    if (!authToken) {
      return NextResponse.json(
        { message: "Login succeeded but auth token was not returned." },
        { status: 502 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });
    response.cookies.set("authtoken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Unable to process login right now." },
      { status: 500 },
    );
  }
}
