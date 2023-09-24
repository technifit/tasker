import { Link } from "@remix-run/react"
import type { V2_MetaFunction } from "@vercel/remix"
import { $path } from "remix-routes"

import { Typography } from "@technifit/ui"

import { ResetPasswordForm } from "./forms/reset-password-form"

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Tasker | Log In" },
    { name: "description", content: "Log in" },
  ]
}

export const ResetPassword = () => {
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-4">
      <div className="flex flex-col space-y-2 text-center">
        <Typography variant={"h1"} className="lg:text-2xl">
          Reset Password
        </Typography>
        <Typography variant={"mutedText"}>
          Enter the code from your email and your new password
        </Typography>
      </div>
      <ResetPasswordForm />
      <Typography variant={"mutedText"} className="text-center">
        Dont have an account?{" "}
        <Link
          prefetch="intent"
          to={$path("/sign-up")}
          className="underline underline-offset-4 hover:text-primary"
        >
          Reset Password
        </Link>
        .
      </Typography>
    </div>
  )
}

export default ResetPassword
