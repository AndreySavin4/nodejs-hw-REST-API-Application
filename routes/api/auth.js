const express = require("express");
const {
  register,
  loginIn,
  current,
  logout,
} = require("../../controllers/users");
const authentificate = require("../../middlewares/authentificate");

const router = express.Router();

router.post("/users/register", register);
router.post("/users/login", loginIn);
router.get("/users/current", authentificate, current);
router.post("/users/logout", authentificate, logout);

module.exports = router;
