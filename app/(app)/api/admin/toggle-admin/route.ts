import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const isUserAdmin = await isAdmin();

  if (!isUserAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { userId, isAdmin: targetIsAdmin } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Find the role ID for ADMIN
    const adminRole = await prisma.roles.upsert({
      where: { name: "ADMIN" },
      update: {},
      create: { name: "ADMIN" },
    });

    if (targetIsAdmin) {
      // Add ADMIN role
      await prisma.user_roles.upsert({
        where: {
          user_id_role_id: {
            user_id: userId,
            role_id: adminRole.id,
          },
        },
        update: {},
        create: {
          user_id: userId,
          role_id: adminRole.id,
        },
      });
    } else {
      // Remove ADMIN role
      await prisma.user_roles.deleteMany({
        where: {
          user_id: userId,
          role_id: adminRole.id,
        },
      });
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error: any) {
    console.error("[Toggle Admin API Error]:", error);
    return NextResponse.json(
      { error: "Failed to update user", message: error.message },
      { status: 500 }
    );
  }
}
