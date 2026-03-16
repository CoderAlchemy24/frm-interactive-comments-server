const userService = require("../services/users.service");

exports.getCurrentUser = (req, res) => {
  res.json(userService.getCurrentUser());
};

exports.patchCurrentUser = (req, res) => {
  const updated = userService.patchCurrentUser(req.body);
  res.json(updated);
};