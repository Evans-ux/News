"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { PenTool, FileText, AlignLeft, Type, Loader2, ArrowLeft, Sparkles, Eye, ImageIcon, UploadCloud, TagIcon, List, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const CATEGORIES = [
  "World",
  "Politics",
  "General",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Health",
  "Science"
]

export default function CreatePost() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [urlToImage, setUrlToImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [category, setCategory] = useState(CATEGORIES[0])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const router = useRouter()

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('post-images')
        .upload(fileName, file);

      if (error) {
        toast.error(`Upload failed: ${error.message}`, { position: "top-center" });
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      setUrlToImage(publicUrlData.publicUrl);
      toast.success("Image uploaded successfully!", { position: "top-center" });
    } catch (err) {
      toast.error("Error uploading image.", { position: "top-center" });
    } finally {
      setIsUploadingImage(false);
    }
  }

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
        body: JSON.stringify({ title, content, description, urlToImage: urlToImage || null, category, tags }),
      })

      if (res.ok) {
        toast.success("Post published successfully!", { position: "top-center" })
        setTitle("")
        setDescription("")
        setContent("")
        setUrlToImage("")
        setTags([])
        setCategory(CATEGORIES[0])
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
                  {urlToImage && (
                    <div className="rounded-xl overflow-hidden border border-border">
                      <img src={urlToImage} alt="Cover" className="w-full h-48 object-cover" />
                    </div>
                  )}
                  <h2 className="text-2xl font-black text-foreground leading-tight">
                    {title || "Untitled Post"}
                  </h2>
                  {description && (
                    <p className="text-base text-muted-foreground italic border-l-4 border-red-600 pl-4">
                      {description}
                    </p>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {tags.map(t => (
                        <span key={t} className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">#{t}</span>
                      ))}
                    </div>
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

              {/* Category and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
                    <List className="w-4 h-4 text-red-500" />
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm appearance-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
                    <TagIcon className="w-4 h-4 text-red-500" />
                    Tags
                  </label>
                  <div className="w-full px-3 py-2 min-h-[46px] rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-red-500/40 focus-within:border-red-500 transition-all duration-200 flex flex-wrap gap-2 items-center">
                    {tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-foreground">
                        {t}
                        <button type="button" onClick={() => removeTag(t)} className="text-muted-foreground hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder={tags.length === 0 ? "Add tags (press Enter)..." : ""}
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60 focus:ring-0 border-0 p-0"
                    />
                  </div>
                </div>
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

              {/* Cover Image URL */}
              {/* Cover Image */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-red-500" />
                  Cover Image
                  <span className="text-muted-foreground font-normal text-xs">(upload or enter URL)</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={urlToImage}
                    onChange={(e) => setUrlToImage(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm"
                  />
                  <label className="cursor-pointer flex items-center justify-center px-4 py-3 bg-muted/50 hover:bg-muted text-foreground font-semibold rounded-xl border border-input transition-all w-auto whitespace-nowrap gap-2">
                    {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isUploadingImage ? "Uploading..." : "Upload File"}</span>
                    <input type="file" accept="image/" className="hidden" onChange={handleImageUpload} disabled={isUploadingImage} />
                  </label>
                </div>
                {urlToImage && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-border bg-muted/30">
                    <img src={urlToImage} alt="Preview" className="w-full h-32 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )}
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