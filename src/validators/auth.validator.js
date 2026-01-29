import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    email: z.email({ error: "Invalid email address" }),
    name: z.string().min(3, { error: "Name must be at least 3 characters long" }),
    password: z.string().min(6, { error: "Password must be at least 6 characters long" }),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.email({ error: "Invalid email address" }),
    password: z.string().min(1, { error: "Password is required" }),
  }),
});
