const FetchNewsByGnewsio = async (category?: string) => {
  const res = await fetch(
    `https://gnews.io/api/v4/top-headline?category=${category}&lang=en&country=us&max=10&apikey=0791030da576c2ae30c502ad74cd0c39`,
    { next: { revalidate: 3600 } }
  );

  const data = await res.json();
  if (res.ok) {
    return data.Article;
  }
  
};

export default FetchNewsByGnewsio;
