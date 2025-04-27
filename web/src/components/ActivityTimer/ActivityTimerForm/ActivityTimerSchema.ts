import { z } from 'zod';

import { activityTypes } from 'src/components/Activity/ActivityForm/constants';

const ActivityTimerSchema = z
  .object({
    mediaSlug: z.string().optional(),
    activityType: z.enum(activityTypes as [string, ...string[]]),
    notes: z
      .string()
      .max(300, {
        message: 'Notes must be 300 characters or less',
      })
      .optional(),
    languageId: z.coerce.number().min(1, { message: 'Language is required' }),
    customMediaTitle: z
      .string()
      .min(2, 'Title must be at least 2 characters')
      .max(255, 'Title must be less than 255 characters')
      .optional(),
  })
  .refine(data => !(data.mediaSlug && data.customMediaTitle), {
    message: 'Cannot select media and create custom media at the same time',
    path: ['customMediaTitle'],
  });

export { ActivityTimerSchema };
export type ActivityTimerSchemaType = z.infer<typeof ActivityTimerSchema>;
