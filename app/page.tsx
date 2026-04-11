
import Error from 'next/error';
import React, { Suspense } from 'react';

import Displaynews from '../components/components/Displaynews';
import Load from '@/components/ui/_components/load';
import TrendingSidebar from '@/components/components/TrendingSidebar';
import BreakingNews from '@/components/components/BreakingNews';
import { createDummyPost } from './actions/database';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const fetchAllNews = async (country: string = "us") => {
  try {
    const response = await fetch(
      `https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=${country}&max=10&apikey=0791030da576c2ae30c502ad74cd0c39`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

const fetchnews = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const countryQuery = resolvedSearchParams?.country;
  const country = typeof countryQuery === "string" ? countryQuery : "us";

  const news = await fetchAllNews(country);
  const alldata = news?.articles || [];

  // Dynamic Slicing Logic to handle Free Tier (10 articles) gracefully
  // Breaking News gets 3, Trending gets 3, Rest goes to Main Feed
  const breakingData = alldata.slice(0, 3);
  const trendingData = alldata.slice(3, 6);
  const mainFeedData = alldata.slice(6);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
      
      {breakingData.length > 0 && (
        <section className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
          <BreakingNews initialNews={breakingData} />
        </section>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        <section className="w-full lg:w-2/3 xl:w-3/4">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-black text-gray-900 border-b-4 pb-1 border-red-600">
              Latest Headlines 
            </h2>
          </div>
          <Suspense fallback={<Load />}>
            {mainFeedData.length > 0 ? (
              <Displaynews data={mainFeedData} />
            ) : (
                <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No additional headlines found for this region.</p>
                </div>
            )}
          </Suspense>
        </section>

        <aside className="w-full lg:w-1/3 xl:w-1/4">
          <div className="sticky top-24">
            <TrendingSidebar news={trendingData} />
          </div>
        </aside>
      </div>

    </main>
  );
};

export default fetchnews;
