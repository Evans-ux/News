interface Article{
title:string
url:string
}

export default function TrendingSidebar({news}:{news:Article[]}){

  return(
    <div className="bg-card rounded-2xl shadow-lg border border-border p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center mb-6 border-b border-border pb-4">
        <div className="w-2 h-6 bg-red-600 rounded-full mr-3 shadow-[0_0_8px_rgba(220,38,38,0.6)]"></div>
        <h2 className="text-xl font-black text-card-foreground uppercase tracking-wide">
          Trending
        </h2>
      </div>

      <ul className="space-y-4">
        {news.slice(0, 6).map((article, index) => (
          <li key={index} className="group border-b border-border/50 last:border-0 pb-4 last:pb-0">
            <a
              href={article.url}
              target="_blank"
              className="flex items-start gap-3"
            >
              <span className="text-3xl font-black text-muted-foreground/30 group-hover:text-red-200 dark:group-hover:text-red-900/50 transition-colors duration-300 leading-none group-hover:scale-110 transform">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-bold text-muted-foreground group-hover:text-red-600 transition-colors duration-300 leading-snug line-clamp-3 mt-1">
                {article.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}