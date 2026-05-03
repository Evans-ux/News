/* eslint-disable @next/next/no-img-element */
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { isUser as checkAuthor } from "../actions/getSession";
import { redirect } from "next/navigation";
import { Mail, Calendar, BookOpen, Settings, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const isAuthor = await checkAuthor();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const authorProfile = await prisma.authors.findUnique({
    where: { user_Id: user.id },
    include: {
      blog_posts: {
        take: 3,
        orderBy: { created_at: "desc" }
      }
    }
  });

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8">
      {/* Header Profile Section */}
      <div className="bg-card border border-border/60 rounded-3xl p-8 shadow-xl shadow-black/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-red-600/20 overflow-hidden">
            {authorProfile?.urlToImage ? (
              <img src={authorProfile.urlToImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              (authorProfile?.name || user.email || "U").charAt(0).toUpperCase()
            )}
          </div>
          
          <div className="space-y-3 flex-1">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                {authorProfile?.name || "User Profile"}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5 leading-none">
                  <Mail className="w-4 h-4 text-red-500" />
                  {user.email}
                </span>
                {isAuthor && authorProfile?.approved && (
                  <span className="flex items-center gap-1.5 leading-none px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Verified Author
                  </span>
                )}
              </div>
            </div>
            
            {authorProfile?.bio && (
              <p className="text-muted-foreground leading-relaxed max-w-2xl italic">
                &ldquo;{authorProfile.bio}&rdquo;
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Link 
              href="/settings"
              className="p-3 bg-muted hover:bg-muted/80 rounded-2xl transition-all"
              title="Profile Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Author Stats/Quick Links */}
        <div className="lg:col-span-1 space-y-6">
          {isAuthor ? (
            <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-lg space-y-6">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-red-600" />
                Author Tools
              </h2>
              <div className="space-y-3">
                <Link 
                  href="/author/dashboard"
                  className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-2xl transition-all group"
                >
                  <span className="font-bold text-sm">Dashboard</span>
                  <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </Link>
                <Link 
                  href="/createpost"
                  className="flex items-center justify-between p-4 bg-red-600 text-white rounded-2xl transition-all hover:bg-red-700 shadow-lg shadow-red-600/20"
                >
                  <span className="font-bold text-sm">New Article</span>
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-lg space-y-4">
              <h2 className="font-bold text-lg text-foreground">Want to publish?</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join our community of authors and share your insights with thousands of readers.
              </p>
              <Link 
                href="/LogAuthors"
                className="block text-center py-3 bg-muted hover:bg-muted/80 font-bold rounded-2xl transition-all"
              >
                Apply as Author
              </Link>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-foreground">Recent Articles</h2>
            {isAuthor && (
              <Link href="/author/dashboard" className="text-sm font-bold text-red-600 hover:underline">
                View All
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {authorProfile?.blog_posts && authorProfile.blog_posts.length > 0 ? (
              authorProfile.blog_posts.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/news/${post.id}`}
                  className="block bg-card border border-border/60 rounded-3xl p-6 hover:shadow-xl hover:border-red-500/20 transition-all group"
                >
                  <div className="flex gap-6">
                    {post.urlToImage && (
                      <div className="hidden sm:block w-32 h-20 rounded-2xl overflow-hidden shrink-0">
                        <img src={post.urlToImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                      </div>
                    )}
                    <div className="space-y-2 flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-foreground truncate group-hover:text-red-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-12 text-center bg-muted/20 border border-dashed border-border rounded-3xl">
                <p className="text-muted-foreground font-medium italic">
                  {isAuthor ? "You haven't published any articles yet." : "This user hasn't published any articles."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
