const express = require("express");
const {
  register,
  loginIn,
  current,
  logout,
  updateAvatar,
} = require("../../controllers/users");
const { authentificate, upload } = require("../../middlewares");

const router = express.Router();

router.post("/users/register", register);

router.post("/users/login", loginIn);

router.get("/users/current", authentificate, current);

router.post("/users/logout", authentificate, logout);

router.patch(
  "/users/avatars",
  authentificate,
  upload.single("avatar"),
  updateAvatar
);

module.exports = router;
