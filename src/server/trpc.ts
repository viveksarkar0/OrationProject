import { initTRPC } from '@trpc/server'
import { db } from '@/lib/db'

export type Context = {
  db: typeof db
}

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

export const createContext = (): Context => ({
  db,
})
