import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Supabase Webhook Handler for auth.users
 * This endpoint should be configured in Supabase:
 * Table: auth.users
 * Events: INSERT
 */
export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }
    console.log(body)
    // Basic verification: Supabase signals which table and schema the event came from
    // Ensure we are only processing INSERT/UPDATE on auth.users
    const { schema, table, record, type } = body;

    if (schema !== "auth" || table !== "users") {
      return NextResponse.json({ message: "Ignored request (not auth.users)" }, { status: 200 });
    }

    if (type === "INSERT" || type === "UPDATE") {
      const { id, email, raw_user_meta_data } = record;

      // Extract full_name from nested metadata
      const name = raw_user_meta_data?.full_name || null;

      if (!id || !email) {
        return NextResponse.json({ error: "Missing required fields (id, email)" }, { status: 400 });
      }

      // Retry mechanism for database operation
      let attempts = 0;
      const maxAttempts = 5;
      let lastError: any;

      while (attempts < maxAttempts) {
        try {
          // Upsert user into our database
          await prisma.user.upsert({
            where: { id: id },
            update: {
              email: email,
              name: name,
            },
            create: {
              id: id,
              email: email,
              name: name,
            },
          });
          
          console.log(`[Webhook] User ${id} synced successfully (${type}) on attempt ${attempts + 1}`);
          return NextResponse.json({ message: "User synced successfully", success: true }, { status: 200 });
        } catch (error: any) {
          attempts++;
          lastError = error;
          console.warn(`[Webhook Attempt ${attempts} failed]:`, error.message);
          if (attempts < maxAttempts) {
            // Exponential backoff: 200ms, 400ms, 800ms, 1600ms
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 100));
          }
        }
      }

      throw lastError; // Re-throw if all attempts fail so catches in outer try-catch returns 500
    }

    return NextResponse.json({ message: "Ignored event type" }, { status: 200 });

  } catch (error: any) {
    console.error("[Webhook Error]:", error);
    // Return a 500 so Supabase knows to retry if retries are enabled
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
