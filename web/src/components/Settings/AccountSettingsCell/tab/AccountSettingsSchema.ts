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

export { ProfileFormSchema };
export type ProfileFormSchemaType = z.infer<typeof ProfileFormSchema>;
