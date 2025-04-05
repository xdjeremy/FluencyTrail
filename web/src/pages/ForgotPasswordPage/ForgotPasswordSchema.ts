import { z } from 'zod';

const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export { ForgotPasswordSchema };
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
