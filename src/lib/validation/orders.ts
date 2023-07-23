import { z } from "zod";

export const GetOrdersValidator = z.object({
  page: z.string().optional().default("1"),
  cn: z.string().optional(),
});

export type GetOrdersValidatorSchema = z.infer<typeof GetOrdersValidator>;
