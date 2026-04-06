import { postRouter } from "./routes/post";

export const appRouter = {
  post: postRouter,
};

export type AppRouter = typeof appRouter;
