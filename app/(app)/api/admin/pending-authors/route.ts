import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const isUserAdmin = await isAdmin();

  if (!isUserAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const pendingAuthors = await prisma.authors.findMany({
      where: {
        approved: false,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        id: "desc", // Or some other criteria
      },
    });

    return NextResponse.json(pendingAuthors);
  } catch (error: any) {
    console.error("[Pending Authors API Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending authors", message: error.message },
      { status: 500 }
    );
  }
}
