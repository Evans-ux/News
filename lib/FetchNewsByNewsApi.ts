const FetchNewsByNewsApi = async (category?: string) => {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=3f71a8eea3ae4686a86dfba0aba7cab5`,
    { next: { revalidate: 3600 } }
  );

  const data = await res.json();
  return data;
};

export default FetchNewsByNewsApi;
/*0lPxNdgCEdhULVR9*/