import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/comment — create a comment
export async function POST(req: NextRequest) {
  try {
    const { content, newsSlug } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "You must be logged in to comment" }, { status: 401 });
    }

    // Ensure the user exists in our DB
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Store comment with slug prefix so we can filter per article
    // Format: "[newsSlug]||actual comment text"
    const slugPrefix = newsSlug ? `[${newsSlug}]||` : "";
    const comment = await prisma.comments.create({
      data: {
        content: `${slugPrefix}${content.trim()}`,
        userId: user.id,
        author_id: null,
        post_id: null,
      },
    });

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        userName: dbUser.name || "Anonymous",
      },
    }, { status: 201 });

  } catch (err) {
    console.error("Comment POST error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// GET /api/comment?slug=... — fetch comments for a news article
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    // Fetch comments that have the slug encoded in their content
    // Format stored: "[slug]||actual comment"
    const comments = await prisma.comments.findMany({
      where: {
        content: { startsWith: `[${slug}]||` },
      },
      include: { User: { select: { name: true } } },
      orderBy: { created_at: "desc" },
    });

    const formatted = comments.map((c) => ({
      id: c.id,
      content: c.content.replace(`[${slug}]||`, ""),
      created_at: c.created_at,
      userName: c.User?.name || "Anonymous",
    }));

    return NextResponse.json({ comments: formatted }, { status: 200 });

  } catch (err) {
    console.error("Comment GET error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
