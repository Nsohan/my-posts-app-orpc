import { db } from "@/db";
import { posts } from "@/db/schema";
import type {
  CreatePostInput,
  UpdatePostInput,
  DeletePostInput,
  GetPostInput,
} from "@/lib/validators/post";
import { eq } from "drizzle-orm";

export const postService = {
  async list() {
    return await db.select().from(posts).orderBy(posts.createdAt);
  },

  async getById({ id }: GetPostInput) {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    if (!post) throw new Error("Post not found");
    return post;
  },

  async create(input: CreatePostInput, authorId: string) {
    const [post] = await db
      .insert(posts)
      .values({ ...input, authorId })
      .returning();
    return post;
  },

  async update(input: UpdatePostInput) {
    const [post] = await db
      .update(posts)
      .set({
        ...(input.title && { title: input.title }),
        ...(input.content && { content: input.content }),
        ...(input.slug && { slug: input.slug }),
        ...(input.published !== undefined && { published: input.published }),
        updatedAt: new Date(),
      })
      .where(eq(posts.id, input.id))
      .returning();
    if (!post) throw new Error("Post not found");
    return post;
  },

  async delete({ id }: DeletePostInput) {
    await db.delete(posts).where(eq(posts.id, id));
    return { success: true };
  },
};
