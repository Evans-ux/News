import Link from "next/link";

const categories = [
  "world",
  "politics",
  "business",
  "technology",
  "sports",
  "entertainment",
  "science",
  "health"
];

export default function CategorySlider() {
  return (
    <div className="overflow-x-auto whitespace-nowrap py-4 px-6 border-b flex justify-center gap-4">
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/category/${cat}`}
          className="px-6 py-2 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors capitalize"
        >
          {cat}
        </Link>
      ))}
    </div>
  );
}