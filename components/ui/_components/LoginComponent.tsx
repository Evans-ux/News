"use client"
import React from 'react'

import { Button } from '@/components/ui/button'
import { toast  } from 'sonner'
 

export const LoginComponent = ({createUser}:{createUser:(formdata:FormData)=>void}) => {




  return (
    <div>

        <form action={createUser} className='bg-amber-100 p-6 m-6'>
            <input name='email' type='text' className='bg-amber-100 p-3 m-3'/>
            <input name='password' type='password'  className='bg-amber-100 p-3 m-3'/> 

               <Button
      variant="outline"
      /*onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },position:"top-center"
        })
      }*/
     onClick={()=>toast.success("validation successfull",{position:"top-center"})}
    >
      Show Toast
    </Button> 
    
  

        
        </form>
    </div>
  )
}
