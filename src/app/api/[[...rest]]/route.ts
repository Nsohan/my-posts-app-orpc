import { appRouter } from '@/lib/orpc/router'
import { createClient } from '@/lib/supabase/server'
import { RPCHandler } from '@orpc/server/fetch'

const handler = new RPCHandler(appRouter)

async function handleRequest(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { response } = await handler.handle(request, {
    prefix: '/api',
    context: {
      userId: user?.id ?? null,
    },
  })

  return response
}

export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const DELETE = handleRequest