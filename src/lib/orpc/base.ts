import { os } from "@orpc/server";
import { createClient } from "@/lib/supabase/server";

export type Context = {
  userId: string | null;
};

export const base = os.$context<Context>();

export const publicProcedure = base;

export const protectedProcedure = base.use(async ({ context, next }) => {
  if (!context.userId) {
    throw new Error("Unauthorized");
  }
  return next({ context: { userId: context.userId } });
});
