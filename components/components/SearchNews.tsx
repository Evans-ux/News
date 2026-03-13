"use client"

import { useState } from "react"

export default function SearchNews(){

const [query,setQuery] = useState("")

const handleSearch = (e:any)=>{
e.preventDefault()

window.location.href = `/search?q=${query}`
}

return(

<form
onSubmit={handleSearch}
className="flex items-center gap-2"
>

<input
type="text"
placeholder="Search news..."
value={query}
onChange={(e)=>setQuery(e.target.value)}
className="border px-3 py-2 rounded w-64"
/>

<button
className="bg-red-600 text-white px-4 py-2 rounded"
>
Search
</button>

</form>

)

}