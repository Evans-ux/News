import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
 
 

export async function isUser() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return false;

    const userWithRoles = await prisma.authors.findUnique({
      where: { user_Id: user.id }
    });

    if (!userWithRoles) return false;
    return true;
  } catch (error) {
    console.error("Error checking user status:", error);
    return false;
  }
}

export async function getSessionforauthors() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    const userWithRoles = await prisma.authors.findUnique({
      where: { user_Id: user.id }
    });

    return userWithRoles;
  } catch (error) {
    console.error("Error getting session for authors:", error);
    return null;
  }
}