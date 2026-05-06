import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"




export default function comment(){
const [content , setContent] = useState("")
const [Commenting, setIsCommenting] = useState(false)
 async function handleComment(e: React.FormEvent){
    e.preventDefault()
    setIsCommenting(true)
    try {
          const res = await fetch("/api/comment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
          })
    
          if (res.ok) {
            toast.success("comment submitted.", { position: "top-center" })
             
          } else {
            const { error } = await res.json()
            toast.error(`${error}`, { position: "top-center" })
         
          }
        } catch {
          toast.error("Network error. Please try again.", { position: "top-center" })
        }finally{setIsCommenting(false)}
      }

    return(
        <div>
            <form onSubmit={handleComment}>
                <input type="text"
                value={content}
                onChange={(e)=> setContent(e.target.value)}
                disabled={Commenting}
                />
                <Button variant={"secondary"}></Button>
                </form>
        </div>
    )
}