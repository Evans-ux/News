import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function isAdmin() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return false;

    const userWithRoles = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!userWithRoles) return false;

    return userWithRoles.user_roles.some(
      (ur) => ur.role.name === "ADMIN"
    );
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function getAdminUser() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    const userWithRoles = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!userWithRoles) return null;

    const isAdminUser = userWithRoles.user_roles.some(
      (ur) => ur.role.name === "ADMIN"
    );

    return isAdminUser ? user : null;
  } catch (error) {
    console.error("Error getting admin user:", error);
    return null;
  }
}

