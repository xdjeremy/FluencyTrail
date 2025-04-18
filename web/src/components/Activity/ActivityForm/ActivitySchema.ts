import { z } from 'zod';

import { activityTypes } from './constants';

const ActivitySchema = z
  .object({
    date: z
      .date({
        required_error: 'Date is required',
      })
      .refine(date => date <= new Date(), {
        message: 'Date cannot be in the future',
      }),
    mediaSlug: z.string().optional(),
    activityType: z.enum(activityTypes as [string, ...string[]]),
    duration: z.coerce
      .number() // Use coerce to convert input string to number
      .min(1, {
        message: 'Duration must be at least 1 minute',
      })
      .max(1440, {
        message: 'Duration must be less than 1440 minutes (24 hours)',
      }),
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

export { ActivitySchema };
export type ActivitySchemaType = z.infer<typeof ActivitySchema>;
