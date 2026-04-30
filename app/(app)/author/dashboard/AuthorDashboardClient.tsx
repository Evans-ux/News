"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { 
  FileText, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Loader2,
  Calendar,
  BarChart3,
  Eye
} from "lucide-react";

type Post = {
  id: string;
  title: string;
  description: string;
  content: string;
  urlToImage: string | null;
  created_at: Date | null;
};

export default function AuthorDashboardClient({ 
  initialPosts,
  authorId 
}: { 
  initialPosts: Post[];
  authorId: string;
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Post deleted successfully");
        setPosts(posts.filter(p => p.id !== id));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete post");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
            <p className="text-2xl font-black text-foreground">{posts.length}</p>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm flex items-center gap-4 group">
          <div className="w-12 h-12 bg-green-600/10 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Avg. Word Count</p>
            <p className="text-2xl font-black text-foreground">
              {posts.length > 0 ? Math.round(posts.reduce((acc, p) => acc + p.content.split(/\s+/).length, 0) / posts.length) : 0}
            </p>
          </div>
        </div>

        <Link 
          href="/createpost"
          className="bg-red-600 hover:bg-red-700 text-white rounded-3xl p-6 shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-red-100">Ready to write?</p>
            <p className="text-xl font-bold">Create New Post</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:rotate-90 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Posts List */}
      <div className="bg-card border border-border/60 rounded-3xl shadow-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-border/60 flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/20">
          <h2 className="text-xl font-bold text-foreground">Your Articles</h2>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search your posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {filteredPosts.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                <FileText className="w-8 h-8" />
              </div>
              <div className="max-w-xs mx-auto">
                <p className="text-lg font-bold">No posts found</p>
                <p className="text-muted-foreground text-sm">
                  {searchQuery ? "Try a different search term or clear the filter." : "You haven't published any articles yet. Start by creating your first post!"}
                </p>
              </div>
              {!searchQuery && (
                <Link href="/createpost" className="mt-2 text-red-600 font-bold hover:underline flex items-center gap-1">
                  Create your first post <Plus className="w-4 h-4" />
                </Link>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-muted/10 transition-all group">
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                  {/* Post Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {post.urlToImage ? (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border border-border flex-shrink-0">
                        <img 
                          src={post.urlToImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                        <FileText className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                    
                    <div className="space-y-1 flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-foreground truncate group-hover:text-red-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap gap-4 pt-2">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Draft'}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                          <Eye className="w-3.5 h-3.5" />
                          -- views
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-none border-border/60">
                    <Link 
                      href={`/author/edit/${post.id}`}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
                      title="Edit Article"
                    >
                      <Edit3 className="w-5 h-5" />
                    </Link>
                    
                    <button 
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting === post.id}
                      className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-xl transition-all relative"
                      title="Delete Article"
                    >
                      {isDeleting === post.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>

                    <Link 
                      href={`/news/${post.id}`} // assuming this is the public route
                      className="ml-2 px-4 py-2 bg-muted text-foreground font-bold rounded-xl text-sm hover:bg-muted/80 transition-all flex items-center gap-2"
                    >
                      View Live
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
