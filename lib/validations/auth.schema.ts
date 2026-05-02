import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").trim(),
    email: z.string().email("Invalid email").trim().toLowerCase(),
    phoneNumber: z.string().min(1, "Phone number is required").trim(),
    dob: z.string().min(1, "Date of birth is required"),
    age: z.coerce.number().min(1, "Invalid age"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required").trim(),
  password: z.string().min(1, "Password is required"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;