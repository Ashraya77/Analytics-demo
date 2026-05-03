import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ countryname: string }> }
) {
  try {
    const { countryname } = await params;
    const response = await fetch(
      `https://www.apicountries.com/name/${encodeURIComponent(countryname)}`,
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Country not found" },
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
