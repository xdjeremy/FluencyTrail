import { z } from 'zod';

const ProfileFormSchema = z.object({
  name: z.string().min(1, {
    message: 'This field is required.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

export { ProfileFormSchema };
export type ProfileFormSchemaType = z.infer<typeof ProfileFormSchema>;
