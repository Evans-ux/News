import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Verify ownership
    const post = await prisma.blog_posts.findUnique({
      where: { id },
      include: { authors: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authors?.user_Id !== user.id) {
      return NextResponse.json({ error: "Forbidden: You don't own this post" }, { status: 403 });
    }

    await prisma.blog_posts.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error: any) {
    console.error("[Post Delete API Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete post", message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { title, content, description, urlToImage } = await req.json();

    // Verify ownership
    const post = await prisma.blog_posts.findUnique({
      where: { id },
      include: { authors: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authors?.user_Id !== user.id) {
      return NextResponse.json({ error: "Forbidden: You don't own this post" }, { status: 403 });
    }

    const updatedPost = await prisma.blog_posts.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        content: content !== undefined ? content : undefined,
        description: description !== undefined ? description : undefined,
        urlToImage: urlToImage !== undefined ? urlToImage : undefined,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error("[Post Patch API Error]:", error);
    return NextResponse.json(
      { error: "Failed to update post", message: error.message },
      { status: 500 }
    );
  }
}
