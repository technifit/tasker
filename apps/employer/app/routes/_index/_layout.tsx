import { Outlet } from "@remix-run/react"
import { type V2_MetaFunction } from "@vercel/remix"

import { UserNav } from "./components/user-nav"

// export const config = { runtime: 'edge' };

export { loader } from "./_layout.server"

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Tasker" },
    { name: "description", content: "Large scale job processing done right" },
  ]
}

export const Index = () => {
  return (
    <div className="container grid grid-cols-1 py-4 lg:grid-cols-1">
      <div className="flex flex-col gap-2">
        <div className="flex justify-end">
          <UserNav />
        </div>
        <div className="flex grow flex-col items-center justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Index
