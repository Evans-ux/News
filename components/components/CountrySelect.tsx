"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

const countries = [
  { code: "us", name: "United States", flag: "🇺🇸" },
  { code: "gb", name: "United Kingdom", flag: "🇬🇧" },
  { code: "ca", name: "Canada", flag: "🇨🇦" },
  { code: "au", name: "Australia", flag: "🇦🇺" },
  { code: "in", name: "India", flag: "🇮🇳" },
  { code: "ng", name: "Nigeria", flag: "🇳🇬" },
  { code: "ie", name: "Ireland", flag: "🇮🇪" },
]

export default function CountrySelect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  const currentCountry = searchParams.get("country") || "us"

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    params.set("country", code)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="relative inline-block">
      <select
        value={currentCountry}
        onChange={handleChange}
        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-1.5 pl-3 pr-8 rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 cursor-pointer hover:bg-white transition-all shadow-sm"
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.name.split(' ')[0]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  )
}
