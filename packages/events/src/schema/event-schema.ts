import { z } from 'zod';

const internalEventTypeEnum = z.enum(['embed:dimensions-change', 'embed:ready', 'embed:close', 'embed:page-change']);

const embedCloseEventSchema = z.object({
  type: z.literal(internalEventTypeEnum.Enum['embed:close']),
  payload: z.null(),
});

const embedReadyEventSchema = z.object({
  type: z.literal(internalEventTypeEnum.Enum['embed:ready']),
  payload: z.null(),
});

const embedDimensionsChangeEventSchema = z.object({
  type: z.literal(internalEventTypeEnum.Enum['embed:dimensions-change']),
  payload: z.object({
    width: z.number(),
    height: z.number(),
  }),
});

const embedPageChangeEventSchema = z.object({
  type: z.literal(internalEventTypeEnum.Enum['embed:page-change']),
  payload: z.object({
    url: z.string(),
  }),
});

const internalEventSchema = z.union([
  embedCloseEventSchema,
  embedReadyEventSchema,
  embedDimensionsChangeEventSchema,
  embedPageChangeEventSchema,
]);

type InternalEvent = z.infer<typeof internalEventSchema>;

export type { InternalEvent };
export { internalEventSchema };
