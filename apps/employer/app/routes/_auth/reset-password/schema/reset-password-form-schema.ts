import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export const resetPasswordSchema = z.object({
  code: z
    .string({ required_error: "Please enter your password reset code" })
    .min(6, { message: "Code should be 6 characters" })
    .max(6, { message: "Code should be 6 characters" }),
  password: z
    .string({ required_error: "Please enter your new password" })
    .min(6, { message: "Password should be a minimum of 6 characters" })
    .max(9, { message: "Password should be a maximum of 9 characters" }),
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export const resetPasswordResolver = zodResolver(resetPasswordSchema)
