"use server"
import { createClient } from "@/lib/supabase/server"
 

type  datatypes  =  {
    password:string,
    email:string
}
const LoginUser = async (userdata:datatypes)=>{
const  supabase  =  await  createClient()

 
  
const  {data:user,  error} =  await supabase.auth.signInWithPassword({
    email:userdata?.email,
    password:userdata?.password,

  
})

if(error){
    console.log(error)
    return {error:error?.message,  success:false,  message:"login user failed"}
}

return {
    error: null, 
    success: true, 
    userdata: JSON.parse(JSON.stringify(user)), 
    message: "user logged in successfully"
}
}
export default LoginUser