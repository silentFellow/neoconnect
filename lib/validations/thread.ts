import { z } from "zod";

const threadValidation = z.object({
  thread: z.string().min(3, 'Your thread must be at least 3 characters long'),
  accountId: z.string()
})

const commentValidation = z.object({
  thread: z.string().min(3, 'Your comment must be at least 3 characters long'),
})

export {
  threadValidation,
  commentValidation
}
