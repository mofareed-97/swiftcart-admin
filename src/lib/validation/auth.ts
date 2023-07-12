import { z } from "zod";

export const AuthValidator = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(5, { message: "Password must be at least 4 digits" }),
});
