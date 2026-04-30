import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const isUserAdmin = await isAdmin();

  if (!isUserAdmin) {
    redirect("/"); // Or a custom 403 page
  }

  const pendingAuthors = await prisma.authors.findMany({
    where: { approved: false },
    include: {
      user: {
        select: { email: true, name: true }
      }
    },
    orderBy: { id: "desc" }
  });

  const allAuthors = await prisma.authors.findMany({
    include: {
      user: {
        select: { email: true, name: true }
      }
    },
    orderBy: { name: "asc" }
  });

  const allUsers = await prisma.user.findMany({
    include: {
      user_roles: {
        include: { role: true }
      },
      authors: true
    },
    orderBy: { email: "asc" }
  });


  return (
    <div className="p-6 lg:p-10 space-y-8 bg-background min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage author applications and platform settings.
        </p>
      </div>

      <AdminDashboardClient 
        initialPendingAuthors={pendingAuthors} 
        allAuthors={allAuthors}
        allUsers={allUsers}
      />
    </div>
  );
}
