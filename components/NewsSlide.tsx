"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "swiper/css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  image?: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export default function BreakingNews({ initialNews = [] }: { initialNews?: Article[] }) {
  const [news, setNews] = useState<Article[]>(initialNews);
  const [loading, setLoading] = useState(!initialNews.length);

  useEffect(() => {
    if (initialNews.length > 0) {
      setNews(initialNews);
      setLoading(false);
      return;
    }
    
    // Fallback fetch if no props are passed
    const fetchNews = async () => {
      try {
        const res = await fetch(
          "https://gnews.io/api/v4/top-headlines?category=general&lang=en&max=5&apikey=0791030da576c2ae30c502ad74cd0c39"
        );
        const data = await res.json();
        setNews(data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [initialNews]);

  if (loading) {
    return (
      <p className="text-center text-lg font-semibold py-10">
        Loading breaking news...
      </p>
    );
  }

  return (
    <div className="w-full relative">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop
      >
        {news.map((article, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[400px]">

              <img
                src={article.image || article.urlToImage || "/news-placeholder.jpg"}
                alt={article.title}
                className="object-cover w-full h-96"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <a
                  href={article.url}
                  target="_blank"
                  className="text-white text-2xl md:text-3xl font-bold text-center px-6"
                >
                  {article.title}
                </a>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}