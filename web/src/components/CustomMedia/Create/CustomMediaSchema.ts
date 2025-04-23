import { z } from 'zod';

const CustomMediaSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: 'Title cannot be empty',
    })
    .max(100, {
      message: 'Title cannot be more than 100 characters',
    }),
});

export { CustomMediaSchema };
export type CustomMediaSchemaType = z.infer<typeof CustomMediaSchema>;
