import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signinSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: z.string(),
  questionTypes: z.array(z.string()),
  totalQuestions: z.number().positive("Total questions must be positive"),
  totalMarks: z.number().positive("Total marks must be positive"),
  instructions: z.string().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
