import { z } from 'zod';

const ProfileFormSchema = z.object({
  name: z.string().min(1, {
    message: 'This field is required.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  timezone: z.string().min(1, 'Please select your timezone'),
});

const PasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Please enter your current password'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export { PasswordFormSchema, ProfileFormSchema };
export type ProfileFormSchemaType = z.infer<typeof ProfileFormSchema>;
export type PasswordFormSchemaType = z.infer<typeof PasswordFormSchema>;
