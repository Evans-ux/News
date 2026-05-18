import Image from "next/image";

interface Article {
  title: string;
  description: string;
  content: string;
  urlToImage?: string;
  image?: string;
  url?: string;
  publishedAt?: string;
  author?: string;
  source?: {
    name?: string;
  };
}

interface NewsDetailProps {
  article: Article;
}

export default function NewsDetailpage({ article }: NewsDetailProps) {
  // GNews API returns 'image', NewsAPI returns 'urlToImage'
  const imageUrl = article.urlToImage || article.image;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      
      {/* Article Header */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        {article.publishedAt && (
          <div className="text-red-600 font-bold uppercase tracking-widest text-sm mb-4">
            {new Date(article.publishedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-tight mb-6">
          {article.title}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed">
          {article.description}
        </p>

      </header>

      {/* Hero Image */}
      {imageUrl && (
        <figure className="mb-12 rounded-2xl overflow-hidden shadow-lg border border-border bg-muted/20 aspect-video relative">
          <img

            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </figure>
      )}

      {/* Article Content */}
      <div className="max-w-2xl mx-auto prose prose-lg prose-red dark:prose-invert text-foreground/90">
        <p className="whitespace-pre-line leading-loose text-lg font-serif">
          {article.content?.replace(/\[\+\d+ chars\]/g, '')}
        </p>
      </div>


      {/* Truncation Notice */}
      {article.content && article.content.includes('[+') && (
        <div className="max-w-2xl mx-auto mt-12 bg-muted/30 border border-border rounded-xl p-6 sm:p-8 text-center shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-2">Read the Full Story</h3>
          <p className="text-muted-foreground mb-6">
            This article preview has been truncated by the news provider. To read the full, uninterrupted article, please visit the original source.
          </p>
          {article.url && (

            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center bg-red-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
            >
              Continue Reading
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          )}
        </div>
      )}

    </article>
  );
}