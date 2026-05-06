"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { UserCheck, Sparkles, Send, PenTool, Loader2, CheckCircle2, ArrowRight, ImageIcon, UploadCloud } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function BecomeAuthor() {
  const [bio, setBio] = useState("")
  const [name, setName] = useState("")
  const [social_media_handle, setSocialMediaHandle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [urlToImage, setUrlToImage] = useState("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/become-author", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, name, social_media_handle, urlToImage:urlToImage || null }),
      })

      if (res.ok) {
        toast.success("Application submitted! We'll review it shortly.", { position: "top-center" })
        setSubmitted(true)
      } else {
        const { error } = await res.json()
        toast.error(`${error}`, { position: "top-center" })
        if (error === "Already applied") {
          setSubmitted(true)
        }
      }
    } catch {
      toast.error("Network error. Please try again.", { position: "top-center" })
    } finally {
      setIsLoading(false)
    }
  }


  //handle image upload

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;
  
      setIsUploadingImage(true);
      try {
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('profile-images')
          .upload(fileName, file);
  
        if (error) {
          toast.error(`Upload failed: ${error.message}`, { position: "top-center" });
          return;
        }
  
        const { data: publicUrlData } = supabase.storage
          .from('profile-images')
          .getPublicUrl(fileName);
  
        setUrlToImage(publicUrlData.publicUrl);
        toast.success("Image uploaded successfully!", { position: "top-center" });
      } catch (err) {
        toast.error("Error uploading image.", { position: "top-center" });
      } finally {
        setIsUploadingImage(false);
      }
    }
  
  // Success state after submission
  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center">
          <div className="bg-card text-card-foreground rounded-3xl shadow-2xl border border-border/60 p-10 space-y-6">
            {/* Success animation */}
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
              <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full shadow-lg shadow-green-500/30">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Application Submitted!
              </h1>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                Your author application is under review. We&apos;ll notify you once it&apos;s approved.
                This usually takes 24-48 hours.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl transition-all duration-200 text-sm"
              >
                Back to Home
              </Link>
              <Link
                href="/createpost"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-200 text-sm shadow-lg shadow-red-600/20 hover:shadow-red-600/30"
              >
              
                <PenTool className="w-4 h-4" />
                Write a Post
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Hero section */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/10 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Join Our Community
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Become an Author
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Share your insights with the world. Apply to become a NewsHub author and start publishing articles.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl border border-border/60 overflow-hidden">
          {/* Card header with icon */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-5 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Author Application</h2>
              <p className="text-red-100 text-xs">Fill in your details below</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">
                Author Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Your pen name or real name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Tell us about yourself — your expertise, interests, writing experience..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {bio.length}/500 characters
              </p>
            </div>

            {/* Social Media */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">
                Social Media Handle
                <span className="text-muted-foreground font-normal ml-1">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                <input
                  type="text"
                  placeholder="username"
                  value={social_media_handle}
                  onChange={(e) => setSocialMediaHandle(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Profile Image */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-red-500" />
                Profile Image
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
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingImage} />
                </label>
              </div>
              {urlToImage && (
                <div className="mt-2 rounded-xl overflow-hidden border border-border bg-muted/30">
                  <img src={urlToImage} alt="Preview" className="w-full h-32 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
            </div>

            {/* Info box */}
            <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1 bg-blue-500/10 rounded-lg shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <p className="font-semibold text-foreground mb-0.5">Review Process</p>
                  Applications are reviewed within 24-48 hours. Once approved, you&apos;ll be able to create and publish posts.
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-600/30 disabled:opacity-60 disabled:cursor-not-allowed text-sm uppercase tracking-wide inline-flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Application
                </>
              )}
            </button>

            {/* Footer link */}
            <p className="text-center text-xs text-muted-foreground pt-1">
              Already an approved author?{" "}
              <Link href="/auth/createpost" className="text-red-600 font-bold hover:underline">
                Create a Post →
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}