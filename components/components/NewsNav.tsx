"use client"

import Link from "next/link"
import { useState } from "react"
import CountrySelect from "./CountrySelect"

const categories = [
  "World",
  "Politics",
  "General",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Health",
  "Science"
]

export default function Navbar() {
  const [query, setQuery] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
    }
  }

  return (
    <header className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black text-red-600 tracking-tight">
          NewsHub<span className="text-black">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 items-center justify-between ml-8">
          <nav className="flex gap-6 text-sm font-semibold text-gray-600">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                className="hover:text-red-600 transition-colors uppercase tracking-wide text-xs"
                href={`/category/${cat.toLowerCase()}`}
              >
                {cat}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4 ml-4">
            {/* Country Selector */}
            <CountrySelect />

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
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 -mr-2 text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-red-100 rounded-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 shadow-lg absolute w-full left-0">
          <form onSubmit={handleSearch} className="flex items-center w-full mb-6">
            <input
              type="text"
              placeholder="Search news..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border border-gray-300 bg-gray-50 rounded-l-full px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
            />
            <button type="submit" className="bg-red-600 text-white px-5 py-2.5 rounded-r-full text-sm font-semibold">
              Search
            </button>
          </form>

          <nav className="flex flex-col space-y-1 text-base font-semibold text-gray-700">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-red-600 hover:bg-red-50 px-4 py-3 rounded-md transition-colors">Home</Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-red-600 hover:bg-red-50 px-4 py-3 rounded-md transition-colors"
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}