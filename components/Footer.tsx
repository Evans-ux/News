"use client"

import Link from "next/link"
import { Github, Twitter, Linkedin, Facebook, Mail } from "lucide-react"

const categories = [
  "World", "Politics", "General", "Business", "Technology", "Sports", "Entertainment", "Health", "Science"
]

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="text-3xl font-black text-red-600 tracking-tight">
              NewsHub<span className="text-foreground">.</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs transition-colors">
              Stay ahead with real-time global reporting, in-depth analysis, and breaking news from across the world.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-red-600 hover:text-white transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-red-600 hover:text-white transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-red-600 hover:text-white transition-all duration-300">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-red-600 hover:text-white transition-all duration-300">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-black mb-6 uppercase tracking-wider text-foreground">Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase()}`}
                  className="text-muted-foreground hover:text-red-600 text-sm font-bold transition-colors uppercase tracking-wide"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact / Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-black mb-6 uppercase tracking-wider text-foreground">Help & Contact</h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:contact@newshub.com" className="flex items-center gap-3 text-muted-foreground hover:text-red-600 transition-colors group">
                  <Mail size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold">contact@newshub.com</span>
                </a>
              </li>
              <li className="text-sm font-bold text-muted-foreground">
                <Link href="/about" className="hover:text-red-600 transition-colors">About Us</Link>
              </li>
              <li className="text-sm font-bold text-muted-foreground">
                <Link href="/privacy" className="hover:text-red-600 transition-colors">Privacy Policy</Link>
              </li>
              <li className="text-sm font-bold text-muted-foreground">
                <Link href="/terms" className="hover:text-red-600 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <p>© {new Date().getFullYear()} NewsHub Media Group. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="hover:text-red-600 cursor-pointer transition-colors">Sitemap</span>
            <span className="hover:text-red-600 cursor-pointer transition-colors">Careers</span>
            <span className="hover:text-red-600 cursor-pointer transition-colors">API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
