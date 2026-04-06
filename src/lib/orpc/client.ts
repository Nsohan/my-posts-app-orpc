import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createORPCReactQueryUtils } from '@orpc/react-query'
import type { AppRouter } from './router'

const link = new RPCLink({
  url: typeof window !== 'undefined'
    ? `${window.location.origin}/api`
    : `${process.env.NEXT_PUBLIC_APP_URL}/api`,
})

export const client = createORPCClient<AppRouter>(link)
export const orpc = createORPCReactQueryUtils(client)