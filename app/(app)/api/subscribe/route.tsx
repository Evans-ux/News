import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const { email } = await req.json()

    if (!email) {
        return NextResponse.json({
            error: "please provide email",
        }, { status: 400 })
    }
    try{
        const subscriber = await prisma.subscribers.create({
           data:{
            email: email
           }
        })

        if (subscriber) {
             return NextResponse.json({
                 message: "You have successfully subscribed",
                 status: 200
             }, { status: 200 })
         }
    }catch(err:any){
        if (err.code === "P2002") {
            return NextResponse.json({
                error: "This email is already subscribed!"
            }, { status: 400 })
        }
        console.log(err?.message)
        return NextResponse.json({
            error: "Something went wrong!"
        }, { status: 500 })
    }
}