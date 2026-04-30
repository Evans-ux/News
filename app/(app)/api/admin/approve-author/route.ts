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

    // Find the author application
    const authorApplication = await prisma.authors.findUnique({
      where: { id: authorId },
      include: { user: true },
    });

    if (!authorApplication) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (!authorApplication.user_Id) {
       return NextResponse.json({ error: "Application has no associated user" }, { status: 400 });
    }

    // Perform updates in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Approve the author
      const updatedAuthor = await tx.authors.update({
        where: { id: authorId },
        data: { approved: true },
      });

      // 2. Ensure AUTHOR role exists and assign it to the user
      // First, find or create the AUTHOR role
      const authorRole = await tx.roles.upsert({
        where: { name: "AUTHOR" },
        update: {},
        create: { name: "AUTHOR" },
      });

      // 3. Link user to the role (using upsert to avoid duplicate errors if they already have it)
      await tx.user_roles.upsert({
        where: {
          user_id_role_id: {
            user_id: authorApplication.user_Id,
            role_id: authorRole.id,
          },
        },
        update: {},
        create: {
          user_id: authorApplication.user_Id,
          role_id: authorRole.id,
        },
      });

      return updatedAuthor;
    });

    return NextResponse.json({ message: "Author approved and role assigned", author: result });
  } catch (error: any) {
    console.error("[Approve Author API Error]:", error);
    return NextResponse.json(
      { error: "Failed to approve author", message: error.message },
      { status: 500 }
    );
  }
}
