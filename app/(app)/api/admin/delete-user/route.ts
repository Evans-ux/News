import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const isUserAdmin = await isAdmin();

  if (!isUserAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Delete the user from Prisma. Related records should be handled by Cascade.
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("[Delete User API Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete user", message: error.message },
      { status: 500 }
    );
  }
}
