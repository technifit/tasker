import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const forgotPasswordFormSchema = z.object({
  email: z.string({ required_error: 'Please enter your email' }).email().min(1),
});

export const forgotPasswordSearchParamsSchema = z.object({
  email: z.string().email().optional(),
});

export type ForgotPasswordSearchParams = z.infer<typeof forgotPasswordSearchParamsSchema>;

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

export const forgotPasswordFormResolver = zodResolver(forgotPasswordFormSchema);
