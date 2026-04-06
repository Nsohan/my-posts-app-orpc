import { postService } from '@/services/post.service'
import { protectedProcedure, publicProcedure } from '@/lib/orpc/base'
import {
  createPostSchema,
  deletePostSchema,
  getPostSchema,
  updatePostSchema,
} from '@/lib/validators/post'

export const postRouter = {
  list: publicProcedure.handler(async () => {
    return await postService.list()
  }),

  getById: publicProcedure.input(getPostSchema).handler(async ({ input }) => {
    return await postService.getById(input)
  }),

  create: protectedProcedure
    .input(createPostSchema)
    .handler(async ({ input, context }) => {
      return await postService.create(input, context.userId)
    }),

  update: protectedProcedure
    .input(updatePostSchema)
    .handler(async ({ input }) => {
      return await postService.update(input)
    }),

  delete: protectedProcedure
    .input(deletePostSchema)
    .handler(async ({ input }) => {
      return await postService.delete(input)
    }),
}