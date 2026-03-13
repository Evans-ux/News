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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {data.map((article: Article, index: number) => (

          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col"
          >

            <img
              src={article.image || article.urlToImage || "/news.jpg"}
              alt={article.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-5 flex flex-col flex-grow">

              <h2 className="font-bold text-lg mb-2 line-clamp-2">
                {article.title}
              </h2>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.description}
              </p>

              <Link
                href={`/news/${encodeURIComponent(article.title)}`}
                className="mt-auto text-blue-600 font-medium hover:text-blue-800"
              >
                Read more →
              </Link>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default CategoryNews
/* {
href={`/blog/${item.id}`} key={item.id}
      source: [Object],
      author: 'Raja Rao DV',
      title: "It's 2026, Just Use Postgres",
      description: 'Stop managing multiple databases. Postgres extensions replace Elasticsearch, Pinecone, Redis, MongoDB, and InfluxDB with BM25, vectors, JSONB, and time-series in one database.',       
      url: 'https://www.tigerdata.com/blog/its-2026-just-use-postgres',
      urlToImage: 'https://timescale.ghost.io/blog/content/images/2026/02/just-use-postgres-2026.png',      publishedAt: '2026-02-05T21:24:03Z',
      content: "Think of your database like your home. Your home has a living room, bedroom, bathroom, kitchen, and garage. Each room serves a different purpose. But they're all under the same roof, connected by hal… [+16659 chars]"
    }
*/




 
 