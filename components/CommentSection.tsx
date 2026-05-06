"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { MessageCircle, Send, LogIn } from "lucide-react";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  created_at: string | null;
  userName: string;
}

interface CommentSectionProps {
  newsSlug: string;
  isLoggedIn: boolean;
  userName?: string;
}

export default function CommentSection({ newsSlug, isLoggedIn, userName }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comment?slug=${encodeURIComponent(newsSlug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch {
      // silently fail — comments are non-critical
    } finally {
      setLoading(false);
    }
  }, [newsSlug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, newsSlug }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Comment posted!", { position: "top-center" });
        setContent("");
        // Optimistically prepend the new comment
        setComments((prev) => [data.comment, ...prev]);
      } else {
        toast.error(data.error || "Failed to post comment", { position: "top-center" });
      }
    } catch {
      toast.error("Network error. Please try again.", { position: "top-center" });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <section className="max-w-2xl mx-auto px-4 py-12 border-t border-border mt-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <MessageCircle className="w-5 h-5 text-red-600" />
        <h2 className="text-xl font-black text-foreground">
          Comments
          {comments.length > 0 && (
            <span className="ml-2 text-sm font-semibold text-muted-foreground">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {/* Comment Input */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">
              {userName ? getInitials(userName) : "U"}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={submitting}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm resize-none disabled:opacity-60"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-5 rounded-xl border border-border bg-muted/30 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Sign in to join the conversation.
          </p>
          <Link
            href="/auth/login"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 shrink-0"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted rounded w-24" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No comments yet. Be the first!</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-muted text-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {getInitials(comment.userName)}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-bold text-foreground">{comment.userName}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
