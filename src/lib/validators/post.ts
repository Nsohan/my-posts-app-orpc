import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(100),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  published: z.boolean().default(false),
})

export const updatePostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(100).optional(),
  slug: z.string().min(3).max(100).optional(),
  content: z.string().min(10).optional(),
  published: z.boolean().optional(),
})

export const deletePostSchema = z.object({
  id: z.string().uuid(),
})

export const getPostSchema = z.object({
  id: z.string().uuid(),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type DeletePostInput = z.infer<typeof deletePostSchema>
export type GetPostInput = z.infer<typeof getPostSchema>