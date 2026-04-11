"use client"

import Link from "next/link"
import { useState } from "react"
import CountrySelect from "./CountrySelect"
import Toggle from "./Darkmode"

import { SidebarTrigger } from "@/components/ui/sidebar"

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
    <header className="w-full bg-background shadow-md border-b border-border sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        {/* Logo and Controls */}
        <div className="flex items-center gap-2 sm:gap-4 md:pr-4">
          <SidebarTrigger />
          <Toggle />
        </div>
        <Link href="/" className="text-2xl font-black text-red-600 tracking-tight hover:scale-105 transition-transform">
          NewsHub<span className="text-foreground">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 items-center justify-between ml-8">
          <nav className="flex gap-6 text-sm font-bold text-muted-foreground">
            <Link href="/" className="hover:text-red-600 transition-colors duration-300">Home</Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                className="hover:text-red-600 transition-colors duration-300 uppercase tracking-wide text-xs"
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
            <form onSubmit={handleSearch} className="flex items-center group">
              <input
                type="text"
                placeholder="Search topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border border-border/80 bg-background text-foreground rounded-l-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 text-sm w-36 xl:w-48 transition-all duration-300 shadow-inner group-hover:border-red-300"
              />
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded-r-full text-sm transition-all duration-300 font-bold border border-transparent shadow-[0_0_10px_rgba(220,38,38,0.3)] hover:shadow-[0_0_15px_rgba(220,38,38,0.6)]">
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 -mr-2 text-muted-foreground hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 rounded-md transition-colors"
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
        <div className="lg:hidden bg-background border-t border-border px-4 py-6 shadow-2xl absolute w-full left-0 z-50 animate-in slide-in-from-top-2 duration-300">
          <form onSubmit={handleSearch} className="flex items-center w-full mb-6">
            <input
              type="text"
              placeholder="Search news..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border border-border bg-muted/30 text-foreground rounded-l-full px-4 py-3 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
            />
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-r-full text-sm font-bold shadow-md transition-colors">
              Search
            </button>
          </form>

          <nav className="flex flex-col space-y-2 text-base font-bold text-foreground">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-3 rounded-xl transition-all duration-300">Home</Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-3 rounded-xl transition-all duration-300"
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