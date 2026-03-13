"use client"
import React from 'react'
import { ClipLoader } from 'react-spinners'

const Load = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-slate-800 rounded-lg p-8 shadow-2xl border border-slate-700">
                        <ClipLoader  color="#60a5fa" size={60} />
                        <p className="text-white text-center mt-4 font-medium">Loading posts...</p>
                    </div>
                </div>
                </div>
  )
}

export default Load