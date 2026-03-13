import { Suspense } from "react";
import Load from "../../components/ui/_components/load";
import Displaynews from "../../components/components/Displaynews";
import TrendingSidebar from "../../components/components/TrendingSidebar";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};


export default async function SearchPage({
  searchParams,
}: Props) {
  const resolvedParams = await searchParams;
  const rawQuery = resolvedParams.q;
  const query = typeof rawQuery === 'string' ? rawQuery : Array.isArray(rawQuery) ? rawQuery[0] : "";

  const countryQuery = resolvedParams.country;
  const country = typeof countryQuery === 'string' ? countryQuery : "us";


  let searchResults = [];
  let trendingResults = [];

  if (query) {
    try {
      // Fetch search results
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=${country}&max=10&apikey=0791030da576c2ae30c502ad74cd0c39`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const data = await res.json();
        searchResults = data.articles || [];
      }

      // Fetch trending for sidebar
      const resTrending = await fetch(
        `https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=${country}&max=10&apikey=0791030da576c2ae30c502ad74cd0c39`,
        { next: { revalidate: 3600 } }
      );
      if (resTrending.ok) {
        const trendData = await resTrending.json();
        trendingResults = trendData.articles || [];
      }
    } catch (error) {
      console.error("Search fetch error:", error);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <section className="w-full lg:w-2/3 xl:w-3/4">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
            <h2 className="text-2xl font-black text-gray-900 border-b-4 pb-1 border-red-600 -mb-[10px]">
              Search Results
            </h2>
            {query && (
              <span className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                "{query}"
              </span>
            )}
          </div>

          {!query ? (
             <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-700">Ready to search</h3>
                <p className="text-gray-500 mt-2">Enter a keyword above to find news articles in your region.</p>
             </div>
          ) : searchResults.length > 0 ? (
            <Suspense fallback={<Load />}>
              <Displaynews data={searchResults} searchQuery={query} />
            </Suspense>
          ) : (
             <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-700">No results found</h3>
                <p className="text-gray-500 mt-2 mb-6">We couldn't find any news articles matching "{query}" in the selected region.</p>
                <Link href="/" className="inline-flex items-center text-red-600 font-semibold hover:text-red-800">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Back to Homepage
                </Link>
             </div>
          )}
        </section>

        <aside className="w-full lg:w-1/3 xl:w-1/4">
          <div className="sticky top-24">
            <TrendingSidebar news={trendingResults} />
          </div>
        </aside>
      </div>
    </main>
  );
}
