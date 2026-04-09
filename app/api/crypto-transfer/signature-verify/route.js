import { NextResponse } from "next/server";

function joinUrl(base, path) {
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export async function POST(request) {
  const rootApi = process.env.NEXT_ROOT_API;

  if (!rootApi) {
    return NextResponse.json(
      { message: "NEXT_ROOT_API is not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const endpoint = joinUrl(rootApi, "/spump/sale/signature/verify");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        txHash: body?.txHash,
      }),
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      let message = "Signature verification failed.";

      if (contentType.includes("application/json")) {
        const errorJson = await response.json();
        if (errorJson?.message) message = errorJson.message;
      } else {
        const errorText = await response.text();
        if (errorText) message = errorText;
      }

      return NextResponse.json({ message }, { status: response.status });
    }

    if (contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    }

    const text = await response.text();
    return NextResponse.json({ data: text }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to verify signature right now." },
      { status: 500 }
    );
  }
}