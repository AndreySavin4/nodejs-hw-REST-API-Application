const { Contact, schema, updateFavoriteContact } = require("../models/contact");
const { HttpError } = require("../helpers");

const getAll = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
      skip,
      limit,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const result = await Contact.findById(id);
    if (!result) {
      next(HttpError(404, "Not found"));
      // return res.status(404).json({
      //   message: "Not found",
      // });
    }
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { error } = schema.validate(req.body);
  try {
    if (error) {
      next(HttpError(400, "missing required name field"));
      // return res.status(400).json({
      //   message: "missing required name field",
      // });
    }
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const result = await Contact.findOneAndRemove(id);
    if (!result) {
      next(HttpError(404, "Not found"));
      // return res.status(404).json({
      //   message: "Not found",
      // });
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const body = req.body;
  const { error } = schema.validate(body);
  try {
    const id = req.params.contactId;
    const result = await Contact.findByIdAndUpdate(id, body, { new: true });
    if (error) {
      next(HttpError(400, "missing fields"));
      // return res.status(400).json({
      //   message: "missing fields",
      // });
    } else if (!result) {
      next(HttpError(404, "Not found"));
      // return res.status(404).json({
      //   message: "Not found",
      // });
    }
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  const body = req.body;
  const { error } = updateFavoriteContact.validate(body);
  try {
    const id = req.params.contactId;
    const result = await Contact.findByIdAndUpdate(id, body, { new: true });
    if (error) {
      next(HttpError(400, "missing field favorite"));
      // return res.status(400).json({
      //   message: "missing field favorite",
      // });
    } else if (!result) {
      next(HttpError(400, "Not found"));
      // return res.status(404).json({
      //   message: "Not found",
      // });
    }
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  addContact,
  deleteContact,
  update,
  updateStatusContact,
};
