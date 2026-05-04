// app/api/countries/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://www.apicountries.com/countries", {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch countries" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    console.log("Country update payload:", payload);

    return NextResponse.json({
      ok: true,
      received: payload,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Invalid country payload" },
      { status: 400 }
    );
  }
}
