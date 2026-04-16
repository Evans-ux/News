import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const supabase =  await createClient()
    const { data: {user} } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, {status: 401})

        const author = await prisma.authors.findUnique({
            where: {user_Id: user.id}
        })

        if (!author) return NextResponse.json({ error: "You must apply to be an author."}, {status:403})
        if (!author.approved) return NextResponse.json({ error: "Author application pending"}, { status: 403})

            const {title, content, description } = await req.json()
            if (!title || !content || !description) {
                return NextResponse.json({ error: "Title, content, and description are required." }, { status: 400 })
            }
            const post = await prisma.blog_posts.create({
                data:{
                    title,
                    content,
                    description,
                    author_id: author.id
                }
            })
            return NextResponse.json(post)
} 