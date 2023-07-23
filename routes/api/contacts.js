const express = require("express");

const authenticate = require("../../middlewares/authentificate");

const router = express.Router();
const {
  getAll,
  getById,
  addContact,
  deleteContact,
  update,
  updateStatusContact,
} = require("../../controllers/contacts");

router.get("/", authenticate, getAll);

router.get("/:contactId", authenticate, getById);

router.post("/", authenticate, addContact);

router.delete("/:contactId", authenticate, deleteContact);

router.put("/:contactId", authenticate, update);

router.patch("/:contactId/favorite", authenticate, updateStatusContact);

module.exports = router;
