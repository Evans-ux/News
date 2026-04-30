import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const isUserAdmin = await isAdmin();

  if (!isUserAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { authorId } = await req.json();

    if (!authorId) {
      return NextResponse.json({ error: "Missing authorId" }, { status: 400 });
    }

    // Delete the application
    await prisma.authors.delete({
      where: { id: authorId },
    });

    return NextResponse.json({ message: "Author application declined and removed" });
  } catch (error: any) {
    console.error("[Decline Author API Error]:", error);
    return NextResponse.json(
      { error: "Failed to decline author", message: error.message },
      { status: 500 }
    );
  }
}
