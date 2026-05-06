import { notFound } from "next/navigation";
import Link from "next/link";
import NewsDetailpage from "@/components/newsDetails";
import CommentSection from "@/components/CommentSection";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

interface Article {
  title: string;
  description: string;
  content: string;
  urlToImage?: string;
  image?: string;
  author?: string;
  publishedAt?: string;
  url?: string;
}

type Props = Promise<{
  slug: string;
}>;

export default async function Page({ params }: { params: Props }) {
  const resolvedParams = await params;
  const decodedTitle = decodeURIComponent(resolvedParams.slug);

  // Check auth server-side so we can pass it to the comment section
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userName: string | undefined;
  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true },
    });
    userName = dbUser?.name ?? user.email ?? undefined;
  }

  // Robust Sanitization:
  // 1. Remove all special characters to avoid 400 Bad Request
  // 2. Limit to exactly 6 words. GNews fails to find articles if the search query is too long or precise.
  const query = decodedTitle
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .join(" ")
    .trim();

  // Fetch from GNews API using sanitized keywords
  const res = await fetch(
    `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=10&apikey=0791030da576c2ae30c502ad74cd0c39`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    console.error("Failed to fetch news details:", res.status, res.statusText);
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-red-600">Sync Error</h2>
        <p>GNews API returned a {res.status} error.</p>
        <p className="mt-2 text-sm text-gray-500 italic">
          Try searching for keywords instead.
        </p>
      </div>
    );
  }

  const data = await res.json();

  // Robust matching: find article with title similarity
  const normalize = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, "");
  const searchTitleNorm = normalize(decodedTitle);

  let finalArticle: Article | undefined = data.articles?.find((a: Article) => {
    const artTitleNorm = normalize(a.title);
    return (
      artTitleNorm === searchTitleNorm ||
      artTitleNorm.includes(searchTitleNorm) ||
      searchTitleNorm.includes(artTitleNorm)
    );
  });

  // If no match but we got results, fallback to the 1st result
  if (!finalArticle && data.articles?.length > 0) {
    finalArticle = data.articles[0];
  }

  // If literally no articles found at all, return a polite "Not Found" UI
  if (!finalArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-4">
          Article Not Found
        </h2>
        <p className="text-gray-600 mb-8 text-lg font-medium">
          We couldn&apos;t locate this specific story. It may have expired or been moved.
        </p>
        <Link
          href="/"
          className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors"
        >
          Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <>
      <NewsDetailpage article={finalArticle} />
      <CommentSection
        newsSlug={resolvedParams.slug}
        isLoggedIn={!!user}
        userName={userName}
      />
    </>
  );
}
