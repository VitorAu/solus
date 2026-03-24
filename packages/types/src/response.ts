import { z } from "zod";

export const SuccessResponseSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    status: z.literal("success"),
    message: z.string(),
    data: data.optional(),
  });

export const SuccessResponseNoDataSchema = z.object({
  status: z.literal("success"),
  message: z.string(),
});

export const ErrorResponseSchema = z.object({
  status: z.literal("error"),
  message: z.string(),
  error: z.string().optional(),
});

export type SuccessResponseType = z.infer<typeof SuccessResponseSchema>;
export type SuccessResponseNoDataType = z.infer<
  typeof SuccessResponseNoDataSchema
>;
export type ErrorResponseType = z.infer<typeof ErrorResponseSchema>;
