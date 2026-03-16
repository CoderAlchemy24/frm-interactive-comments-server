const express = require("express");
const controller = require("../controllers/users.controller");
const validate = require("../middleware/validate");
const { patchCurrentUserSchema } = require("../schemas/user.schema");

const router = express.Router();

router.get("/", controller.getCurrentUser);
router.patch("/", validate(patchCurrentUserSchema), controller.patchCurrentUser);

module.exports = router;