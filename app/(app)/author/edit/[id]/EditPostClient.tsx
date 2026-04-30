/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import {  AlignLeft, Type, Loader2, ArrowLeft, Sparkles, ImageIcon, Save, UploadCloud } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Post = {
  id: string;
  title: string;
  description: string;
  content: string;
  urlToImage: string | null;
};

export default function EditPostClient({ post }: { post: Post }) {
  const [title, setTitle] = useState(post.title)
  const [description, setDescription] = useState(post.description)
  const [content, setContent] = useState(post.content)
  const [urlToImage, setUrlToImage] = useState(post.urlToImage || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const router = useRouter()

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
        toast.error(`Upload failed: ${error.message}`);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      setUrlToImage(publicUrlData.publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error("Error uploading image.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !description.trim()) {
      toast.error("All fields are required.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, description, urlToImage: urlToImage || null }),
      })

      if (res.ok) {
        toast.success("Post updated successfully!")
        router.push("/author/dashboard")
        router.refresh()
      } else {
        const { error } = await res.json()
        toast.error(`${error}`)
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/10 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Edit3 className="w-3.5 h-3.5" />
            Editing Mode
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Edit Article
          </h1>
          <p className="text-muted-foreground text-sm">
            Updates will be reflected immediately on the live site.
          </p>
        </div>
        <Link
          href="/author/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Link>
      </div>

      {/* Main Form/Preview */}
      <div className="bg-card text-card-foreground rounded-3xl shadow-2xl border border-border/60 overflow-hidden">
        {/* Tab switcher */}
        <div className="flex bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all rounded-t-2xl ${
              !isPreview ? "bg-card text-red-600 shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all rounded-t-2xl ${
              isPreview ? "bg-card text-red-600 shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Preview
          </button>
        </div>

        {isPreview ? (
          /* Preview Mode */
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            <article className="space-y-4">
              {urlToImage && (
                <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
                  <img src={urlToImage} alt="Cover" className="w-full h-64 object-cover" />
                </div>
              )}
              <h2 className="text-3xl font-black text-foreground leading-tight">
                {title || "Untitled Post"}
              </h2>
              {description && (
                <p className="text-lg text-muted-foreground italic border-l-4 border-red-600 pl-4 py-1">
                  {description}
                </p>
              )}
              <hr className="border-border" />
              <div className="prose prose-red max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                {content || "No content yet..."}
              </div>
            </article>
          </div>
        ) : (
          /* Editor Mode */
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground inline-flex items-center gap-2">
                  <Type className="w-4 h-4 text-red-600" />
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-600" />
                  Summary
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground inline-flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-red-600" />
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground inline-flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-red-600" />
                  Cover Image (upload or enter URL)
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={urlToImage}
                    onChange={(e) => setUrlToImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-3 rounded-xl border border-input bg-background/50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                  />
                  <label className="cursor-pointer flex items-center justify-center px-4 py-3 bg-muted/50 hover:bg-muted text-foreground font-semibold rounded-xl border border-input transition-all w-auto whitespace-nowrap gap-2">
                    {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isUploadingImage ? "Uploading..." : "Upload Image"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingImage} />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Update Article
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function Edit3(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}
