import { z } from "zod";

const emailSchema = z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(255);

const passwordSchema = z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(100);

export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(50),
    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(50),
    phoneNumber: z
        .string()
        .trim()
        .optional()
});

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required")
});