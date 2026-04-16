"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { PenTool, FileText, AlignLeft, Type, Loader2, ArrowLeft, Sparkles, Eye } from "lucide-react"

export default function CreatePost() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !description.trim()) {
      toast.error("All fields are required.", { position: "top-center" })
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, description }),
      })

      if (res.ok) {
        toast.success("Post published successfully!", { position: "top-center" })
        setTitle("")
        setDescription("")
        setContent("")
        router.push("/")
      } else {
        const { error } = await res.json()
        toast.error(`${error}`, { position: "top-center" })
      }
    } catch {
      toast.error("Network error. Please try again.", { position: "top-center" })
    } finally {
      setIsLoading(false)
    }
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/10 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <PenTool className="w-3.5 h-3.5" />
              Author Portal
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Create New Post
            </h1>
            <p className="text-muted-foreground text-sm">
              Write and publish an article on NewsHub.
            </p>
          </div>
          <Link
            href="/auth/LogAuthors"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Card */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl border border-border/60 overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className={`flex-1 py-3.5 text-sm font-bold tracking-wide uppercase transition-all duration-300 inline-flex items-center justify-center gap-2 ${
                !isPreview
                  ? "text-red-600 border-b-[3px] border-red-600 bg-background"
                  : "text-muted-foreground hover:text-foreground bg-muted/30"
              }`}
            >
              <PenTool className="w-4 h-4" />
              Write
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className={`flex-1 py-3.5 text-sm font-bold tracking-wide uppercase transition-all duration-300 inline-flex items-center justify-center gap-2 ${
                isPreview
                  ? "text-red-600 border-b-[3px] border-red-600 bg-background"
                  : "text-muted-foreground hover:text-foreground bg-muted/30"
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          {isPreview ? (
            /* Preview Mode */
            <div className="p-8 space-y-6">
              {title || description || content ? (
                <article className="space-y-4">
                  <h2 className="text-2xl font-black text-foreground leading-tight">
                    {title || "Untitled Post"}
                  </h2>
                  {description && (
                    <p className="text-base text-muted-foreground italic border-l-4 border-red-600 pl-4">
                      {description}
                    </p>
                  )}
                  <hr className="border-border" />
                  <div className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                    {content || "No content yet..."}
                  </div>
                </article>
              ) : (
                <div className="py-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">Nothing to preview yet.</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Switch to Write tab and start creating.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Write Mode */
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
                  <Type className="w-4 h-4 text-red-500" />
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Give your article a compelling headline..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm font-medium"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-500" />
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="A brief summary that hooks readers — this appears in article previews..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/200 characters recommended
                </p>
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-red-500" />
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Write your article here. Tell a story, share insights, inform your readers..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {wordCount} word{wordCount !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ~{Math.max(1, Math.ceil(wordCount / 200))} min read
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-600/30 disabled:opacity-60 disabled:cursor-not-allowed text-sm uppercase tracking-wide inline-flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <PenTool className="w-4 h-4" />
                      Publish Post
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer tip */}
        <div className="mt-6 bg-muted/50 rounded-xl p-4 border border-border/50">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 p-1 bg-amber-500/10 rounded-lg shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground mb-0.5">Writing Tips</p>
              Use a clear, descriptive title. Keep your description concise to hook readers.
              Break your content into paragraphs for readability.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}