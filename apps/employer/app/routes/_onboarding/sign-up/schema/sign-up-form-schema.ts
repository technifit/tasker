import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const signUpFormSchema = z.object({
  firstName: z.string({ required_error: 'Please enter your first name' }).min(1),
  lastName: z.string({ required_error: 'Please enter your last name' }).min(1),
  email: z.string({ required_error: 'Please enter your email' }).email().min(1),
  password: z.string({ required_error: 'Please enter your password' }).min(8),
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export const signUpFormResolver = zodResolver(signUpFormSchema);
