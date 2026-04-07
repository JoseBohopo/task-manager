import { z } from "zod";

export const StatusSchema = z.enum(["PENDING", "COMPLETED"]);

export const TaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  status: StatusSchema,
});

export const CreateTaskSchema = TaskSchema.omit({ id: true });

export const UpdateTaskSchema = TaskSchema.omit({ id: true }).partial();

export type Status = z.infer<typeof StatusSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

export type ServiceErrorCode = "NOT_FOUND" | "VALIDATION_ERROR";

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: ServiceErrorCode; message: string } };
