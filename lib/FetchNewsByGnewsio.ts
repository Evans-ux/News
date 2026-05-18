const FetchNewsByGnewsio = async (category?: string) => {
  try {
    const res = await fetch(
      `https://gnews.io/api/v4/top-headline?category=${category}&lang=en&country=us&max=10&apikey=0791030da576c2ae30c502ad74cd0c39`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.error(`GNews API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return data.articles || []; // GNews uses 'articles' plural, but let's check
  } catch (error) {
    console.error("Error fetching news from GNews:", error);
    return [];
  }
};

export default FetchNewsByGnewsio;

