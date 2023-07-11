import { z } from "zod";

export const ProductValidator = z.object({
  name: z.string(),
  price: z.number().or(z.string()),
  description: z.string(),
  slug: z.string().optional(),
  category: z.string(),
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

// images: z
// .any()
// .refine((val) => {
//   if (!Array.isArray(val)) return false;
//   if (val.some((file) => !(file instanceof File))) return false;
//   return true;
// }, "Must be an array of File")
// .optional()
// .nullable()
// .default(null),
