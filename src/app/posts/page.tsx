'use client'

import { orpc } from '@/lib/orpc/client'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PostsPage() {
  const router = useRouter()

  const { data: posts, isLoading } = useQuery(
    orpc.post.list.queryOptions()
  )

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading posts...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">My Posts</h1>
        <div className="flex gap-3">
          <Link
            href="/posts/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            + New Post
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-red-500 transition"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Posts Grid */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {posts?.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg">No posts yet.</p>
            <Link href="/posts/create" className="text-blue-500 hover:underline text-sm">
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts?.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm border p-6 flex justify-between items-start"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {post.title}
                    </h2>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        post.published
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {post.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2 ml-4 shrink-0">
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/posts/${post.id}/delete`}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}