const commentsService = require("../services/comments.service");

function sendMutationResult(res, result, options = {}) {
  if (result.error === "comment_not_found") {
    return res.status(404).json({ error: "Comment not found" });
  }

  if (result.error === "reply_not_found") {
    return res.status(404).json({ error: "Reply not found" });
  }

  if (result.error === "forbidden") {
    return res.status(403).json({
      error: "You can only edit or delete your own comments and replies"
    });
  }

  if (result.error === "invalid_reply_target") {
    return res.status(400).json({
      error: "replyingTo must reference the parent comment or one of its replies"
    });
  }

  if (options.message) {
    return res.json({ message: options.message });
  }

  return res.status(options.statusCode || 200).json(result.data);
}

exports.getComments = (req, res) => {
  res.json(commentsService.getAllComments());
};

exports.getComment = (req, res) => {
  const comment = commentsService.getCommentById(Number(req.params.id));

  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  return res.json(comment);
};

exports.createComment = (req, res) => {
  const result = commentsService.createComment(req.body);
  return sendMutationResult(res, result, { statusCode: 201 });
};

exports.updateComment = (req, res) => {
  const result = commentsService.updateComment(Number(req.params.id), req.body);
  return sendMutationResult(res, result);
};

exports.patchComment = (req, res) => {
  const result = commentsService.patchComment(Number(req.params.id), req.body);
  return sendMutationResult(res, result);
};

exports.deleteComment = (req, res) => {
  const result = commentsService.deleteComment(Number(req.params.id));
  return sendMutationResult(res, result, { message: "Comment deleted" });
};

exports.getReplies = (req, res) => {
  const replies = commentsService.getReplies(Number(req.params.id));

  if (!replies) {
    return res.status(404).json({ error: "Comment not found" });
  }

  return res.json(replies);
};

exports.createReply = (req, res) => {
  const result = commentsService.createReply(Number(req.params.id), req.body);
  return sendMutationResult(res, result, { statusCode: 201 });
};

exports.patchReply = (req, res) => {
  const result = commentsService.patchReply(
    Number(req.params.id),
    Number(req.params.replyId),
    req.body
  );

  return sendMutationResult(res, result);
};

exports.deleteReply = (req, res) => {
  const result = commentsService.deleteReply(
    Number(req.params.id),
    Number(req.params.replyId)
  );

  return sendMutationResult(res, result, { message: "Reply deleted" });
};

exports.upvoteComment = (req, res) => {
  const result = commentsService.changeCommentScore(Number(req.params.id), 1);
  return sendMutationResult(res, result);
};

exports.downvoteComment = (req, res) => {
  const result = commentsService.changeCommentScore(Number(req.params.id), -1);
  return sendMutationResult(res, result);
};

exports.upvoteReply = (req, res) => {
  const result = commentsService.changeReplyScore(
    Number(req.params.id),
    Number(req.params.replyId),
    1
  );

  return sendMutationResult(res, result);
};

exports.downvoteReply = (req, res) => {
  const result = commentsService.changeReplyScore(
    Number(req.params.id),
    Number(req.params.replyId),
    -1
  );

  return sendMutationResult(res, result);
};