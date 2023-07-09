const express = require("express");
const Joi = require("joi");

const router = express.Router();
const contacts = require("../../models/contacts");

const schema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ru"] } })
    .required(),
  phone: Joi.number().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const result = await contacts.getContactById(id);
    if (!result) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    res.json({ result });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const body = req.body;
  const { error } = schema.validate(body);
  try {
    if (error) {
      return res.status(400).json({
        message: "missing required name field",
      });
    }
    const result = await contacts.addContact(body);
    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const result = await contacts.removeContact(id);
    if (!result) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  const body = req.body;
  const { error } = schema.validate(body);
  try {
    const id = req.params.contactId;
    const result = await contacts.updateContact(id, body);
    if (error) {
      return res.status(400).json({
        message: "missing fields",
      });
    } else if (!result) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    res.json({ result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
