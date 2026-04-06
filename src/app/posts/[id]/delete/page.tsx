"use client";

import { orpc } from "@/lib/orpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

export default function DeletePostPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: post, isLoading } = useQuery(
    orpc.post.getById.queryOptions({ id }),
  );

  const { mutate: deletePost, isPending } = useMutation(
    orpc.post.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(orpc.post.list.queryOptions());
        router.push("/posts");
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-800 text-sm"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-red-500">Delete Post</h1>
      </nav>

      <main className="max-w-md mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-5">
          <div className="text-center space-y-2">
            <div className="text-4xl">🗑️</div>
            <h2 className="text-lg font-semibold text-gray-800">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-500">You are about to delete:</p>
            <p className="text-sm font-medium text-gray-800 bg-gray-50 rounded-lg px-4 py-2">
              "{post?.title}"
            </p>
            <p className="text-xs text-red-400">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.back()}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => deletePost({ id })}
              disabled={isPending}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition"
            >
              {isPending ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
