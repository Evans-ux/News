import React, { Suspense } from "react";
import Displaynews from "../../../components/components/Displaynews";
import TrendingSidebar from "../../../components/components/TrendingSidebar";
import Load from "@/components/ui/_components/load";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  image?: string;
  content: string;
  author: string;
  publishedAt: string;
}

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const fetchCategoryNews = async (category: string, country: string = "us") => {
  try {
    const response = await fetch(
      `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=${country}&max=10&apikey=0791030da576c2ae30c502ad74cd0c39`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

const CategoryPage = async ({ params, searchParams }: Props) => {
  const category = (await params).category;
  const resolvedSearchParams = await searchParams;
  const countryQuery = resolvedSearchParams?.country;
  const country = typeof countryQuery === "string" ? countryQuery : "us";

  const data = await fetchCategoryNews(category, country);
  const alldata: Article[] = data?.articles || [];

  // Consistent slicing: Trending gets 3, Displaynews gets the rest
  const trendingData = alldata.slice(0, 3);
  const mainFeedData = alldata.slice(3);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10 bg-gray-50/30">
      
      <div className="flex flex-col lg:flex-row gap-10">
        <section className="w-full lg:w-2/3 xl:w-3/4">
          <div className="flex items-center mb-6 border-b-2 border-gray-100 pb-4">
            <h1 className="text-3xl font-black text-gray-900 border-b-4 pb-1 border-red-600 -mb-[18px] capitalize">
              {category} News
            </h1>
          </div>
          
          <Suspense fallback={<Load />}>
            {mainFeedData.length > 0 ? (
               <Displaynews data={mainFeedData} category={category} />
            ) : (
                <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No headlines found in {category} for this region.</p>
                </div>
            )}
          </Suspense>
        </section>

        <aside className="w-full lg:w-1/3 xl:w-1/4">
          <div className="sticky top-24 space-y-8">
            <TrendingSidebar news={trendingData} />
            
            <div className="bg-red-600 rounded-2xl p-6 text-white shadow-lg transition-transform hover:scale-[1.02]">
                <h3 className="font-extrabold text-xl mb-2 tracking-tight">Stay Updated</h3>
                <p className="text-sm font-medium opacity-90 mb-5 leading-relaxed">The latest {category} news delivered to your device in real-time.</p>
                <div className="flex bg-white/10 rounded-xl p-1 overflow-hidden focus-within:bg-white/20 transition-colors">
                    <input type="email" placeholder="Email address" className="bg-transparent border-none rounded-l-lg px-3 py-2 text-sm w-full placeholder:text-white/60 focus:outline-none text-white font-semibold" />
                    <button className="bg-white text-red-600 font-black px-4 py-2 rounded-lg text-xs uppercase tracking-tighter">Join</button>
                </div>
            </div>
          </div>
        </aside>
      </div>

    </main>
  );
};

export default CategoryPage;
/* 
politics and world categories were added to the Navbar. 
*/
