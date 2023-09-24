import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export const logInFormSchema = z.object({
  email: z
    .string({ required_error: "Please enter your email" })
    .email()
    .nonempty(),
  password: z.string({ required_error: "Please enter your password" }).min(8),
})

export type LogInFormData = z.infer<typeof logInFormSchema>

export const logInFormResolver = zodResolver(logInFormSchema)
