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
    const endpoint = joinUrl(rootApi, "/spump/sale/transfer/crypto");

    const payload = {
      referenceNo: body?.referenceNo,
      walletAddress: body?.walletAddress,
      txHash: body?.txHash,
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      let message = "Crypto form submission failed.";

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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to submit crypto transfer right now." },
      { status: 500 }
    );
  }
}