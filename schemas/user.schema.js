const { z } = require("zod");

const userImageSchema = z.object({
  png: z.string().min(1, "png path is required"),
  webp: z.string().min(1, "webp path is required")
}).strict();

// Full currentUser shape (used in GET responses and internally)
const currentUserSchema = z.object({
  image: userImageSchema,
  username: z.string().min(1, "username is required")
}).strict();

// Partial update for PATCH /users
const patchCurrentUserSchema = z.object({
  image: userImageSchema.optional(),
  username: z.string().min(1).optional()
}).strict().refine(
  data => data.image !== undefined || data.username !== undefined,
  { message: "At least one field is required" }
);

module.exports = {
  userImageSchema,
  currentUserSchema,
  patchCurrentUserSchema
};