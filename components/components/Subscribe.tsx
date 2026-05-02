"use client"
import React, { Suspense, useState } from "react";
import Displaynews from "@/components/components/Displaynews";
import TrendingSidebar from "@/components/components/TrendingSidebar";
import Load from "@/components/ui/_components/load";
import { ThemeProvider } from "next-themes";

const [email , setEmail] = useState()

const Subscribe = async ({category}:{category:string }) => {
async function handleSubmit()=>{

}

  return (
    <ThemeProvider>
  
            <div className="bg-red-600 rounded-2xl p-6 text-white shadow-lg transition-transform hover:scale-[1.02]">
                <h3 className="font-extrabold text-xl mb-2 tracking-tight">Stay Updated</h3>
                <p className="text-sm font-medium opacity-90 mb-5 leading-relaxed">The latest {category} news delivered to your device in real-time.</p>
                <div className="flex bg-white/10 rounded-xl p-1 overflow-hidden focus-within:bg-white/20 transition-colors">
                   <form onSubmit={handleSubmit}>
                    <input type="email"
                     placeholder="Email address" 
                     className="bg-transparent border-none rounded-l-lg px-3 py-2 text-sm w-full placeholder:text-white/60 focus:outline-none text-white font-semibold" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                      required
                      />
               
                    <button className="bg-white text-red-600 font-black px-4 py-2 rounded-lg text-xs uppercase tracking-tighter">Join</button>
                   </form>
                </div>
            </div>

    </ThemeProvider>
  );
};

export default Subscribe;