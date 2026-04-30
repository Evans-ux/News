import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
 
 

export async function isUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const userWithRoles = await prisma.authors.findUnique({
    where: { user_Id: user.id} 
  });

  if (!userWithRoles) return false;
  return true
}

export async function getSessionforauthors() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const userWithRoles = await prisma.authors.findUnique({
    where: { user_Id: user.id} 
  });

   
  return userWithRoles
}