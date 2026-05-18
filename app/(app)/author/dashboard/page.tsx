import prisma from "@/lib/prisma";
import { getSessionforauthors } from "../../actions/getSession";
import { redirect } from "next/navigation";
import AuthorDashboardClient from "./AuthorDashboardClient";

export const dynamic = "force-dynamic";


export default async function AuthorDashboardPage() {
  const author = await getSessionforauthors();

  if (author === false) {
    redirect("/auth/login");
  }

  if (!author) {
    redirect("/LogAuthors");
  }

  if (!author.approved) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-lg">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h1 className="text-2xl font-black text-foreground">Application Pending</h1>
          <p className="text-muted-foreground leading-relaxed">
            Your author application is still under review. Once an administrator approves your request, you'll be able to access your dashboard and start publishing.
          </p>
          <a href="/" className="inline-block px-6 py-2 bg-muted hover:bg-muted/80 rounded-xl font-bold transition-all">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const posts = await prisma.blog_posts.findMany({
    where: { author_id: author.id },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-background min-h-screen">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
          Author Workspace
        </div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Welcome back, {author.name}
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your published articles and insights.
        </p>
      </div>

      <AuthorDashboardClient initialPosts={posts} authorId={author.id} />
    </div>
  );
}
