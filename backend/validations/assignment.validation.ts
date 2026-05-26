import { z } from "zod";

export const assignmentSchema = z.object({
  title: z.string().min(1),
  dueDate: z.string(),
  questionTypes: z.array(z.string()),
  totalQuestions: z.number().positive(),
  totalMarks: z.number().positive(),
  instructions: z.string().optional(),
});
