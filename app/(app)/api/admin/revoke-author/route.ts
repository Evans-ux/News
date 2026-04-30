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

    // Find the author
    const author = await prisma.authors.findUnique({
      where: { id: authorId },
      include: { user: true },
    });

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    // Perform updates in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Set approved to false
      await tx.authors.update({
        where: { id: authorId },
        data: { approved: false },
      });

      // 2. Remove AUTHOR role from the user
      const authorRole = await tx.roles.findUnique({
        where: { name: "AUTHOR" },
      });

      if (authorRole && author.user_Id) {
        await tx.user_roles.deleteMany({
          where: {
            user_id: author.user_Id,
            role_id: authorRole.id,
          },
        });
      }
    });

    return NextResponse.json({ message: "Author status revoked and role removed" });
  } catch (error: any) {
    console.error("[Revoke Author API Error]:", error);
    return NextResponse.json(
      { error: "Failed to revoke author", message: error.message },
      { status: 500 }
    );
  }
}
