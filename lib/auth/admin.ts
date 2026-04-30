import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function isAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

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
}

export async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

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
}
