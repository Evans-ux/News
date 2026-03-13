"use server"
import { revalidatePath } from 'next/cache'
import React from 'react'

const FetchData = async() => {
    
 const res = await fetch("https://jsonplaceholder.typicode.com/posts")
 const data = await res.json()

 if (res.ok) return data
revalidatePath("/PracticePending")


}

export default FetchData