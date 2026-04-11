import { 
  createUser, 
  subscribeUser, 
  likePost, 
  getDatabaseInfo, 
  createDummyPost 
} from '@/app/actions/database'

/**
 * app/database-demo/page.tsx
 * 
 * This is a Server Component. It can instantly await the database results directly 
 * during the render pass, making the page extremely fast. 
 */
export default async function DatabaseDemoPage() {
  // 1. We grab everything currently stored in our Prisma Database directly!
  const data = await getDatabaseInfo()

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 p-8 space-y-12 max-w-5xl mx-auto">
      <header className="space-y-2 border-b pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Database Playground</h1>
        <p className="text-neutral-500">
          Showing real-time data from your Supabase connected via Prisma to Next.js Server Actions.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ======================= CREATE USER FORM ======================= */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
          <h2 className="text-xl font-bold">1. Create a User</h2>
          <p className="text-sm text-neutral-500">Saves directly to the `User` table.</p>
          
          <form action={async (fd) => { 'use server'; await createUser(fd); }} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <input 
                name="name" 
                type="text" 
                required
                className="w-full px-3 py-2 border rounded-xl"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email Address</label>
              <input 
                name="email" 
                type="email" 
                required
                className="w-full px-3 py-2 border rounded-xl"
                placeholder="john@example.com"
              />
            </div>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              Add User
            </button>
          </form>

          {/* Render the created users fetched directly from Prisma */}
          <div className="pt-4 border-t mt-6">
            <h3 className="font-semibold text-sm text-neutral-400 uppercase tracking-widest mb-3">Live Users</h3>
            <ul className="space-y-2 text-sm">
              {data.users.length === 0 && <span className="text-neutral-400 italic">No users found.</span>}
              {data.users.map((u: any) => (
                <li key={u.id} className="flex justify-between p-2 rounded-lg bg-neutral-50">
                  <span className="font-medium">{u.name || 'Anonymous'}</span>
                  <span className="text-neutral-500">{u.email}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ======================= SUBSCRIBE FORM ======================= */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
          <h2 className="text-xl font-bold">2. Subscribe Form</h2>
          <p className="text-sm text-neutral-500">Saves an email into the `subscribers` table.</p>
          
          <form action={async (fd) => { 'use server'; await subscribeUser(fd); }} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Subscribe Email</label>
              <div className="flex gap-2">
                <input 
                  name="email" 
                  type="email" 
                  required
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="hello@world.com"
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </form>

          {/* Render the subscribers */}
          <div className="pt-4 border-t mt-6">
            <h3 className="font-semibold text-sm text-neutral-400 uppercase tracking-widest mb-3">Recent Subscribers</h3>
            <ul className="space-y-2 text-sm">
              {data.subscribers.length === 0 && <span className="text-neutral-400 italic">No subscribers yet.</span>}
              {data.subscribers.map((s: any) => (
                <li key={s.id} className="p-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-100 flex justify-between">
                  <span>{s.email}</span>
                  <span className="text-emerald-600/60 font-mono text-xs">{new Date(s.subscribed_at || '').toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ======================= LIKE POSTS ======================= */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">3. Like a Blog Post</h2>
              <p className="text-sm text-neutral-500">Uses Prisma to instantly increment the `likes` column!</p>
            </div>
            <form action={createDummyPost}>
               {/* A helpful button to add a test post to play with */}
              <button 
                type="submit" 
                className="px-3 py-1.5 text-sm bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors"
               >
                + Generate Test Post
              </button>
            </form>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
            {data.posts.length === 0 && <span className="text-neutral-400 italic">No posts yet. Generate one above!</span>}
            {data.posts.map((post: any) => (
              <div key={post.id} className="p-4 rounded-xl border flex flex-col justify-between space-y-4 bg-neutral-50/50">
                <div>
                  <h4 className="font-semibold">{post.title}</h4>
                  <p className="text-sm text-neutral-500 line-clamp-2 mt-1">{post.content}</p>
                </div>
                
                <div className="flex items-center justify-between border-t border-neutral-200/60 pt-3">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    ❤️ {post.likes} Likes
                  </span>
                  
                  {/* The Like Action Form! */}
                  <form action={async () => {
                    'use server'
                    await likePost(post.id)
                  }}>
                    <button type="submit" className="text-sm px-3 py-1.5 bg-white border shadow-sm rounded-lg hover:bg-neutral-50 transition-colors font-medium">
                      Like this 
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

    </main>
  )
}
