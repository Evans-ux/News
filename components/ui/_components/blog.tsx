"use client"
import React, { Suspense, use, useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import Link from 'next/link'

type dataProps = Promise<{
  title:string,
  body:string,
  id:number
}[]>




const Blog = ({data}:{data:dataProps}) => {

  const allPoast = use(data)
     

    return (
                <div className="max-w-4xl mx-auto space-y-4">
                    {allPoast.map((item: any) => (
                        <Link href={`/blog/${item.id}`} key={item.id}>
                            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer">
                                <h2 className="text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors capitalize">
                                    {item.title}
                                </h2>
                            </div>
                        </Link>
                    ))}
                </div> 
                )
}

export default Blog