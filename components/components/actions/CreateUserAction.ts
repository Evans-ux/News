"use server"
import { createClient } from "@/lib/supabase/server"


type  datatypes  =  {
    name:string,
    password:string,
    email:string
}
const createUser = async (userdata:datatypes)=>{
const  supabase  =  await  createClient()

const  {data:user,  error} =  await supabase.auth.signUp({
    email:userdata?.email,
    password:userdata?.password,

    options:{
        data:{
            full_name:userdata?.name,
            role:"USER"
        },
      
    }
  
})

if(error){
    console.log(error)
    return {error:error?.message,  success:false,  message:"create user failed!"}
}

return {
    error: null, 
    success: true, 
    userdata: JSON.parse(JSON.stringify(user)), 
    message: "user created successfully!"
}
}
export default createUser