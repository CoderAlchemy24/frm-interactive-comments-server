const { z } = require("zod");

const contentSchema = z.string().trim().min(1, "Content is required");

const createCommentSchema = z.object({
  content: contentSchema
}).strict();

const createReplySchema = z.object({
  content: contentSchema,
  replyingTo: z.string().trim().min(1, "replyingTo is required")
}).strict();

const patchCommentSchema = z.object({
  content: contentSchema.optional()
}).strict().refine(
  data => data.content !== undefined,
  {
    message: "At least one field is required"
  }
);

module.exports = {
  createCommentSchema,
  createReplySchema,
  patchCommentSchema
};