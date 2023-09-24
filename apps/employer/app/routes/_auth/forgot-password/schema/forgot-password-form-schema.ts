import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export const forgotPasswordFormSchema = z.object({
  email: z
    .string({ required_error: "Please enter your email" })
    .email()
    .nonempty(),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>

export const forgotPasswordFormResolver = zodResolver(forgotPasswordFormSchema)
