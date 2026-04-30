import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async  function POST(req:NextRequest){

    const {email,role} = await req.json();

  try{
      const user = await prisma.user.findUnique({
        where:{
            email:email
        }
    })

    if(!user){
        return NextResponse.json({error:"User not found"},{status:404})
    }

    const user_role = await prisma.roles.findUnique({
        where:{
            name:role
        }
    })

    if(!user_role){
        return NextResponse.json({error:"Role not found"},{status:404})
    }

    const userRole = await prisma.user_roles.create({
        data:{
            user:{
                connect:{
                    id:user.id
                }
            },
            role:{
                connect:{
                    id:user_role.id
                }
            }
        }
    })
    if(userRole){
        return NextResponse.json({message:"Role assigned successfully"},{status:200})
    }
    

  }catch(error:any){
    console.log(error?.message)
    return NextResponse.json({error:"Failed to assign role", e:error?.message},{status:500})
  }
}