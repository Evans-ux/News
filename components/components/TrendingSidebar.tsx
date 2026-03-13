interface Article{
title:string
url:string
}

export default function TrendingSidebar({news}:{news:Article[]}){

  return(
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
        <div className="w-2 h-6 bg-red-600 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
          Trending
        </h2>
      </div>

      <ul className="space-y-4">
        {news.slice(0, 6).map((article, index) => (
          <li key={index} className="group border-b border-gray-50 last:border-0 pb-4 last:pb-0">
            <a
              href={article.url}
              target="_blank"
              className="flex items-start gap-3"
            >
              <span className="text-3xl font-black text-gray-200 group-hover:text-red-100 transition-colors leading-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors leading-snug line-clamp-3 mt-1">
                {article.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}