const express = require("express");
const controller = require("../controllers/comments.controller");
const validate = require("../middleware/validate");
const {
  createCommentSchema,
  createReplySchema,
  patchCommentSchema
} = require("../schemas/comment.schema");

const router = express.Router();

router.get("/", controller.getComments);
router.get("/:id", controller.getComment);

router.post(
  "/",
  validate(createCommentSchema),
  controller.createComment
);

router.put(
  "/:id",
  validate(createCommentSchema),
  controller.updateComment
);

router.patch(
  "/:id",
  validate(patchCommentSchema),
  controller.patchComment
);

router.delete("/:id", controller.deleteComment);

router.get("/:id/replies", controller.getReplies);

router.post(
  "/:id/replies",
  validate(createReplySchema),
  controller.createReply
);

router.patch(
  "/:id/replies/:replyId",
  validate(patchCommentSchema),
  controller.patchReply
);

router.post("/:id/upvote", controller.upvoteComment);
router.post("/:id/downvote", controller.downvoteComment);
router.post("/:id/replies/:replyId/upvote", controller.upvoteReply);
router.post("/:id/replies/:replyId/downvote", controller.downvoteReply);

router.delete("/:id/replies/:replyId", controller.deleteReply);

module.exports = router;