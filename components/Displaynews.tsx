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
            className="bg-card rounded-3xl shadow-md hover:shadow-2xl hover:shadow-red-900/10 border border-border overflow-hidden transition-all duration-500 flex flex-col md:flex-row group transform hover:-translate-y-1"
          >
            <div className="md:w-5/12 overflow-hidden bg-muted h-64 md:h-auto shrink-0 relative">
              <img
                src={mainnews.image || mainnews.urlToImage || "/news-placeholder.jpg"}
                alt={mainnews.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest shadow-lg shadow-red-600/30">
                  {category || "Latest"}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-10 flex flex-col flex-1 justify-between relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors duration-500"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-black mb-4 text-card-foreground group-hover:text-red-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  <Link href={`/news/${encodeURIComponent(mainnews.title)}`}>
                    {mainnews.title}
                  </Link>
                </h3>

                <p className="text-muted-foreground text-sm md:text-base mb-8 line-clamp-3 leading-relaxed font-medium group-hover:text-foreground transition-colors duration-300">
                  {mainnews.description}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/50 relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 font-black text-xs ring-2 ring-red-100 dark:ring-red-900/30 shadow-sm">
                    {mainnews.source?.name?.charAt(0) || 'N'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-card-foreground">{mainnews.source?.name || 'NewsHub'}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {mainnews.publishedAt ? new Date(mainnews.publishedAt).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/news/${encodeURIComponent(mainnews.title)}`}
                  className="inline-flex items-center bg-foreground text-background dark:bg-red-600 dark:text-white px-5 py-2.5 rounded-full font-bold text-xs hover:bg-red-600 hover:text-white dark:hover:bg-red-500 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-red-600/30 w-fit"
                >
                  Read More
                  <svg className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
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
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-foreground dark:bg-red-600 font-pj rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 hover:bg-red-600 hover:shadow-red-600/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
