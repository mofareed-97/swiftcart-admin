import { z } from "zod";

export const ProductValidator = z.object({
  name: z.string().min(10),
  // priceInt: z.number().or(z.string().min(1)),
  priceInt: z.string().transform((v) => parseInt(v)),
  // priceInt: z.number().min(1),
  description: z.string().min(10),
  slug: z.string().optional(),
  category: z.string().min(1),
  rating: z.number().optional(),
  mainImage: z.string().or(z.null()).optional(),
  images: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
    })
    .array()
    .or(
      z
        .any()
        .refine((val) => {
          if (!Array.isArray(val)) return false;
          if (val.some((file) => !(file instanceof File))) return false;
          return true;
        }, "Must be an array of File")
        .optional()
        .nullable()
        .default(null)
    ),

  countInStock: z.number().optional().default(1),
});

export const CategoryValidator = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  images: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
    })
    .array()
    .or(
      z
        .any()
        .refine((val) => {
          if (!Array.isArray(val)) return false;
          if (val.some((file) => !(file instanceof File))) return false;
          return true;
        }, "Must be an array of File")
        .optional()
        .nullable()
        .default(null)
    ),
});

export const GetProductsValidator = z.object({
  page: z.string().optional().default("1"),
  categories: z.string().optional(),
});

export type GetProductsValidatorSchema = z.infer<typeof GetProductsValidator>;
