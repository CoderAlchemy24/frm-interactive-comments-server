const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "..", "data", "data.json");

function readData() {
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function getNextId(data) {
  const ids = data.comments.flatMap(comment => [
    comment.id,
    ...comment.replies.map(reply => reply.id)
  ]);

  return ids.length ? Math.max(...ids) + 1 : 1;
}

function findCommentById(data, id) {
  return data.comments.find(comment => comment.id === id) || null;
}

function findReplyById(comment, replyId) {
  return comment.replies.find(reply => reply.id === replyId) || null;
}

function isOwner(entry, currentUser) {
  return entry.user.username === currentUser.username;
}

function canReplyTo(comment, username) {
  if (comment.user.username === username) {
    return true;
  }

  return comment.replies.some(reply => reply.user.username === username);
}

function ok(data) {
  return { data };
}

function error(code) {
  return { error: code };
}

function getAllComments() {
  const data = readData();

  return [...data.comments].sort((left, right) => right.score - left.score);
}

function getCommentById(id) {
  const data = readData();
  return findCommentById(data, id);
}

function createComment(payload) {
  const data = readData();

  const comment = {
    id: getNextId(data),
    content: payload.content,
    createdAt: new Date().toISOString(),
    score: 0,
    user: data.currentUser,
    replies: []
  };

  data.comments.push(comment);
  writeData(data);

  return ok(comment);
}

function updateComment(id, payload) {
  const data = readData();
  const comment = findCommentById(data, id);

  if (!comment) {
    return error("comment_not_found");
  }

  if (!isOwner(comment, data.currentUser)) {
    return error("forbidden");
  }

  comment.content = payload.content;
  writeData(data);

  return ok(comment);
}

function patchComment(id, payload) {
  const data = readData();
  const comment = findCommentById(data, id);

  if (!comment) {
    return error("comment_not_found");
  }

  if (!isOwner(comment, data.currentUser)) {
    return error("forbidden");
  }

  if (payload.content !== undefined) {
    comment.content = payload.content;
  }

  writeData(data);

  return ok(comment);
}

function deleteComment(id) {
  const data = readData();
  const commentIndex = data.comments.findIndex(comment => comment.id === id);

  if (commentIndex === -1) {
    return error("comment_not_found");
  }

  if (!isOwner(data.comments[commentIndex], data.currentUser)) {
    return error("forbidden");
  }

  data.comments.splice(commentIndex, 1);
  writeData(data);

  return ok(true);
}

function getReplies(commentId) {
  const data = readData();
  const comment = findCommentById(data, commentId);

  if (!comment) {
    return null;
  }

  return comment.replies;
}

function createReply(commentId, payload) {
  const data = readData();
  const comment = findCommentById(data, commentId);

  if (!comment) {
    return error("comment_not_found");
  }

  if (!canReplyTo(comment, payload.replyingTo)) {
    return error("invalid_reply_target");
  }

  const reply = {
    id: getNextId(data),
    content: payload.content,
    createdAt: new Date().toISOString(),
    score: 0,
    replyingTo: payload.replyingTo,
    user: data.currentUser
  };

  comment.replies.push(reply);
  writeData(data);

  return ok(reply);
}

function patchReply(commentId, replyId, payload) {
  const data = readData();
  const comment = findCommentById(data, commentId);

  if (!comment) {
    return error("comment_not_found");
  }

  const reply = findReplyById(comment, replyId);

  if (!reply) {
    return error("reply_not_found");
  }

  if (!isOwner(reply, data.currentUser)) {
    return error("forbidden");
  }

  if (payload.content !== undefined) {
    reply.content = payload.content;
  }

  writeData(data);

  return ok(reply);
}

function deleteReply(commentId, replyId) {
  const data = readData();
  const comment = findCommentById(data, commentId);

  if (!comment) {
    return error("comment_not_found");
  }

  const replyIndex = comment.replies.findIndex(reply => reply.id === replyId);

  if (replyIndex === -1) {
    return error("reply_not_found");
  }

  if (!isOwner(comment.replies[replyIndex], data.currentUser)) {
    return error("forbidden");
  }

  comment.replies.splice(replyIndex, 1);
  writeData(data);

  return ok(true);
}

function changeCommentScore(id, delta) {
  const data = readData();
  const comment = findCommentById(data, id);

  if (!comment) {
    return error("comment_not_found");
  }

  comment.score += delta;
  writeData(data);

  return ok(comment);
}

function changeReplyScore(commentId, replyId, delta) {
  const data = readData();
  const comment = findCommentById(data, commentId);

  if (!comment) {
    return error("comment_not_found");
  }

  const reply = findReplyById(comment, replyId);

  if (!reply) {
    return error("reply_not_found");
  }

  reply.score += delta;
  writeData(data);

  return ok(reply);
}

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  patchComment,
  deleteComment,
  getReplies,
  createReply,
  patchReply,
  deleteReply,
  changeCommentScore,
  changeReplyScore
};