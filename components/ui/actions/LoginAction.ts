"use server"
 
 
import { cookies } from 'next/headers'
import { refresh, revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

 
 


  const  bcrypt = require("bcrypt")
  
  

export  async function LoginUser(formdata:FormData){
  "use server"
    const wrongpass = "theuser"
      const saltRounds = 10
      const password = formdata.get("password")
      const  hashpasword  = await bcrypt.hash(password, saltRounds ) 
    
    const  userDetails =  {
        email:formdata.get("email"),
        password:hashpasword
    } 
 
    console.log(userDetails)
     
    let match = await bcrypt.compare(wrongpass , hashpasword)
     console.log(match)
  
     revalidatePath("/LoginComponent")
     refresh()
     redirect("/")
    
     

}


 
export async function ExampleAction() {
  const cookieStore = await cookies()
 
  // Get cookie
  cookieStore.get('name')?.value
 
  // Set cookie
  cookieStore.set('name', 'Delba')
 
  // Delete cookie
  cookieStore.delete('name')
 
}
 
