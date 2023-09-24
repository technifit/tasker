import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const otpFormSchema = z.object({
  otp: z
    .string({ required_error: 'Please enter your one time password' })
    .min(6, { message: 'Code shold be 6 characters' })
    .max(6, { message: 'Code shold be 6 characters' }),
});

export type OtpFormData = z.infer<typeof otpFormSchema>;

export const otpFormResolver = zodResolver(otpFormSchema);
