"use client"

import React, { Suspense, use } from 'react'
import Link from 'next/link'
import Load from './load'

interface propsTypes{
  body:string,
  title:string,
  id:number,
  userId:number
}

const BlogPage = ({data}:{data:propsTypes}) => {
  console.log(data)



    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
                <p className="text-slate-300 text-lg">Post not found</p>
            </div>
        )
    }

    return (
        <Suspense fallback={<Load />}>
          <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/blog" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors">
                    <span className="mr-2">←</span>
                    <span>Back to Posts</span>
                </Link>
                
            
                                  <article className="bg-slate-800 border border-slate-700 rounded-lg p-8 shadow-lg">
                    <h1 className="text-4xl font-bold text-blue-400 mb-6 capitalize leading-tight">
                        {data.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-700">
                        <span className="text-slate-400 text-sm">Post ID: {data.id}</span>
                        <span className="text-slate-400 text-sm">User ID: {data.userId}</span>
                    </div>
                    
                    <div className="prose prose-invert max-w-none">
                        <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                            {data.body}
                        </p>
                    </div>
                </article>
           
            </div>
        </div>
        </Suspense>
    )
}

export default BlogPage