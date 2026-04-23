import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function joinUrl(base, path) {
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export async function POST(_request, { params }) {
  const rootApi = process.env.NEXT_ROOT_API;
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!rootApi) {
    return NextResponse.json(
      { message: "NEXT_ROOT_API is not configured." },
      { status: 500 }
    );
  }

  if (!id) {
    return NextResponse.json({ message: "Transfer id is required." }, { status: 400 });
  }

  try {
    const authToken = (await cookies()).get("authtoken")?.value;
    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const endpoint = joinUrl(rootApi, `/spump/sale/transfer/bank/approve/${id}`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      let message = "Failed to approve bank transfer request.";

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
      { message: "Unable to approve bank transfer request right now." },
      { status: 500 }
    );
  }
}