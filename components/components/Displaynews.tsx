"use client"
import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

type Article = {
  source?: { name: string }
  author?: string
  title: string
  description: string
  url: string
  urlToImage?: string
  image?: string
  content?: string
  publishedAt: string
}

interface DisplaynewsProps {
  data: Article[]
  category?: string
  searchQuery?: string
}

const Displaynews = ({ data, category, searchQuery }: DisplaynewsProps) => {
  const searchParams = useSearchParams()
  const country = searchParams.get("country") || "us"

  const [news, setNews] = useState<Article[]>(data)
  const [page, setPage] = useState(2)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(data.length >= 4) // Adjust for smaller initial slices

  const loadMore = async () => {
    setLoading(true)
    try {
      let url = ""
      const apiKey = "0791030da576c2ae30c502ad74cd0c39"

      if (searchQuery) {
        url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&country=${country}&max=10&page=${page}&apikey=${apiKey}`
      } else if (category) {
        url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=${country}&max=10&page=${page}&apikey=${apiKey}`
      } else {
        url = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=${country}&max=10&page=${page}&apikey=${apiKey}`
      }

      const res = await fetch(url)
      const newData = await res.json()

      if (newData.articles && newData.articles.length > 0) {
        setNews(prev => [...prev, ...newData.articles])
        setPage(prev => prev + 1)
        if (newData.articles.length < 10) setHasMore(false)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading more news:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-8">
        {news.map((mainnews, index) => (
          <article
            key={`${mainnews.url}-${index}`}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row group"
          >
            <div className="md:w-5/12 overflow-hidden bg-gray-100 h-64 md:h-auto shrink-0 relative">
              <img
                src={mainnews.image || mainnews.urlToImage || "/news-placeholder.jpg"}
                alt={mainnews.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest shadow-lg">
                  {category || "Latest"}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-10 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-black mb-4 text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-tight">
                  <Link href={`/news/${encodeURIComponent(mainnews.title)}`}>
                    {mainnews.title}
                  </Link>
                </h3>

                <p className="text-gray-600 text-sm md:text-base mb-8 line-clamp-3 leading-relaxed font-medium">
                  {mainnews.description}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">
                    {mainnews.source?.name?.charAt(0) || 'N'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900">{mainnews.source?.name || 'NewsHub'}</span>
                    <span className="text-[10px] font-semibold text-gray-400">
                      {mainnews.publishedAt ? new Date(mainnews.publishedAt).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/news/${encodeURIComponent(mainnews.title)}`}
                  className="inline-flex items-center bg-gray-900 text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Read More
                  <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="pt-8 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading Content...
              </span>
            ) : (
              "Discover More Articles"
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default Displaynews
