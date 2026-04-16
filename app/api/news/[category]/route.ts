import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const category = (await params).category;

  try {
    
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.NEWS_API_KEY}`
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}