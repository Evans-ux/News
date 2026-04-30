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

            const {title, content, description, urlToImage, category, tags } = await req.json()
            if (!title || !content || !description) {
                return NextResponse.json({ error: "Title, content, and description are required." }, { status: 400 })
            }
            
            const post = await prisma.blog_posts.create({
                data:{
                    title,
                    content,
                    description,
                    urlToImage: urlToImage || null,
                    author_id: author.id,

                    ...(category && {
                        post_categories:{
                            create:[
                                {
                                    categories:{
                                        connectOrCreate:{
                                            where:{
                                            name:category
                                            },
                                            create:{
                                                name:category
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }),
                    
                    ...(tags && tags.length > 0 && {
                        post_tags: {
                            create: tags.map((t: string) => ({
                                tags: {
                                    connectOrCreate: {
                                        where: { name: t },
                                        create: { name: t }
                                    }
                                }
                            }))
                        }
                    })
                }
            })
            return NextResponse.json(post)
} 