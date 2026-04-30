import prisma from "@/lib/prisma";
import { getSessionforauthors } from "@/app/(app)/actions/getSession";
import { redirect, notFound } from "next/navigation";
import EditPostClient from "./EditPostClient";

export default async function EditPostPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const author = await getSessionforauthors();

  if (author === false) {
    redirect("/auth/login");
  }

  if (!author || !author.approved) {
    redirect("/LogAuthors");
  }

  const { id } = await params;

  const post = await prisma.blog_posts.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  if (post.author_id !== author.id) {
    redirect("/author/dashboard");
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <EditPostClient post={post} />
      </div>
    </div>
  );
}
