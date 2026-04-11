"use client"

import Link from "next/link"

type Article = {
  title: string
  description: string
  urlToImage?: string
  image?: string
}

const CategoryNews = ({ data, title }: any) => {
  

  return (
    <div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {data.map((article: Article, index: number) => (

          <div
            key={index}
            className="group bg-card text-card-foreground rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-red-900/15 overflow-hidden transition-all duration-500 flex flex-col border border-border/50 transform hover:-translate-y-1 relative"
          >
            <div className="overflow-hidden relative">
              <img
                src={article.image || article.urlToImage || "/news.jpg"}
                alt={article.title}
                className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-6 flex flex-col flex-grow relative z-10 bg-card">

              <h2 className="font-black text-lg mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300 tracking-tight leading-snug">
                {article.title}
              </h2>

              <p className="text-muted-foreground text-sm mb-6 line-clamp-3 leading-relaxed">
                {article.description}
              </p>

              <Link
                href={`/news/${encodeURIComponent(article.title)}`}
                className="mt-auto inline-flex items-center text-red-600 font-bold hover:text-red-700 transition-colors w-fit group/link"
              >
                Read more 
                <span className="ml-1 group-hover/link:translate-x-1 transition-transform inline-block">→</span>
              </Link>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default CategoryNews