import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";




export async function POST(req: NextRequest){

const supabase = await createClient();
const { data: {user} } = await supabase.auth.getUser()

if(!user) return NextResponse.json({error: "Unauthorized"}, {status: 401})

    const { bio, name, social_media_handle } = await req.json()
    const social_media_links = social_media_handle ? { handle: social_media_handle } : undefined


    const existing = await prisma.authors.findUnique({
        where: { user_Id: user.id}
    })

    if(existing) return NextResponse.json({ error: "Already applied"}, { status:400})
   

    const author = await prisma.authors.create({
    data: {
        user_Id: user.id,
        bio,
        name,
        social_media_links,
        approved: false
    }
})  
return NextResponse.json(author)
}