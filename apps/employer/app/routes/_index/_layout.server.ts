import type { LoaderArgs } from "@vercel/remix"

import { requireAuthenticatedUser } from "~/lib/guards/auth-guard.server"

export const loader = async (args: LoaderArgs) => {
  await requireAuthenticatedUser(args)

  return null
}
