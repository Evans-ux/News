"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const ErrorComponent = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  const router = useRouter()

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100 p-4 text-center'>
      <h1 className='text-3xl font-bold text-red-600 mb-4'>Something went wrong!</h1>
      <p className='text-lg text-gray-700 mb-8 max-w-md'>
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <div className='flex gap-4'>
        <Button 
          className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded'
          onClick={() => reset()}
        >
          Try Again
        </Button>
        <Button 
          variant="outline"
          className='hover:bg-gray-100 border-gray-300'
          onClick={() => router.push("/")}
        >
          Return Home
        </Button>
      </div>
    </div>
  )
}

export default ErrorComponent