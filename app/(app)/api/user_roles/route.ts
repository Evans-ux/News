import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"




export async  function  POST(req: NextRequest){
    
  try{

        const { name } = await req.json()
        const user_role = await prisma.roles.create({
            data: {
                name:name
            }
        })

            if(user_role){
                return NextResponse.json({message: "User role created successfully"})
        }
        else{
            return NextResponse.json({message: "User role not created"})
        }

  }catch(error){
    console.log(error)
    return NextResponse.json({message: "User role not created"})
  }
       
    }