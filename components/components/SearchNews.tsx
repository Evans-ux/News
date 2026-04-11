"use client"

import { useState } from "react"

export default function SearchNews(){

const [query,setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
    }
  }
   {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Search topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border border-gray-300 rounded-l-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 text-sm w-36 xl:w-48 transition-all"
              />
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-r-full text-sm transition-colors font-medium border border-transparent">
                Search
              </button>
            </form>
}
