"use client"
import React, { Suspense, useState } from "react";
import Displaynews from "@/components/components/Displaynews";
import TrendingSidebar from "@/components/components/TrendingSidebar";
import Load from "@/components/ui/_components/load";
import { ThemeProvider } from "next-themes";
import { toast } from "sonner";

const Subscribe = ({category}:{category:string }) => {
const [email , setEmail] = useState<string>("")
const [issubscibing , setIsSubscibing] = useState(false)

function handleSubmit(e: React.FormEvent<HTMLFormElement>){

e.preventDefault()
setIsSubscibing(true)
if(email){
    try {
     const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email}),
      })
      if (res.ok) {
        toast.success("Subscibed successfully", { position: "top-center" })
        setIsSubscibing(false)
      } else {
        const { error } = await res.json()
        toast.error(`${error}`, { position: "top-center" })
}
}catch{
      toast.error("Network error. Please try again.", { position: "top-center" })
    } finally {
      setIsSubscibing(false)
    }
}else{
    toast.error("please provide an email",{position:"top-center"})
}
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
                     disabled={issubscibing}
                     onChange={(e)=>setEmail(e.target.value)}
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