import { Link } from "@remix-run/react"
import type { V2_MetaFunction } from "@vercel/remix"
import { $path } from "remix-routes"

import { Typography } from "@technifit/ui"

import { LoginForm } from "./forms/log-in-form"

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Tasker | Log In" },
    { name: "description", content: "Log in" },
  ]
}

export const SignUp = () => {
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-4">
      <div className="flex flex-col space-y-2 text-center">
        <Typography variant={"h1"} className="lg:text-2xl">
          Sign in
        </Typography>
        <Typography variant={"mutedText"}>
          Enter your email below to access your account
        </Typography>
      </div>
      <LoginForm />
      <Typography variant={"mutedText"} className="text-center">
        Dont have an account?{" "}
        <Link
          prefetch="intent"
          to={$path("/sign-up")}
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign Up
        </Link>
        .
      </Typography>
    </div>
  )
}

export default SignUp
