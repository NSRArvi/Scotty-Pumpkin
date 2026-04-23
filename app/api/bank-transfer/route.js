import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
    const incoming = await request.formData();
    const payload = new FormData();

    const fields = [
      "email",
      "name",
      "receipt",
      "referenceNo",
      "mobileCode",
      "mobile",
      "userAmount",
      "spumpCount",
      "walletAddress",
    ];

    for (const field of fields) {
      const value = incoming.get(field);
      if (value !== null && value !== undefined) {
        payload.append(field, value);
      }
    }

    const endpoint = joinUrl(rootApi, "/spump/sale/transfer/bank");

    const response = await fetch(endpoint, {
      method: "POST",
      body: payload,
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      let message = "Bank transfer submission failed.";

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
      { message: "Unable to submit bank transfer right now." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const rootApi = process.env.NEXT_ROOT_API;

  if (!rootApi) {
    return NextResponse.json(
      { message: "NEXT_ROOT_API is not configured." },
      { status: 500 }
    );
  }

  try {
    const authToken = (await cookies()).get("authtoken")?.value;
    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const endpoint = joinUrl(rootApi, "/spump/sale/transfer/bank");

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      let message = "Unable to load bank transfer forms.";

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
      { message: "Unable to load bank transfer forms right now." },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const rootApi = process.env.NEXT_ROOT_API;

  if (!rootApi) {
    return NextResponse.json(
      { message: "NEXT_ROOT_API is not configured." },
      { status: 500 }
    );
  }

  try {
    const authToken = (await cookies()).get("authtoken")?.value;
    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const endpoint = joinUrl(rootApi, "/spump/sale/transfer/bank/verify");

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        id: body?.id,
        userAmount: body?.userAmount,
        spumpCount: body?.spumpCount,
        formVerification: body?.formVerification,
      }),
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      let message = "Failed to verify bank transfer form.";

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
      { message: "Unable to verify bank transfer form right now." },
      { status: 500 }
    );
  }
}
