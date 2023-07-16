const { Schema, model } = require("mongoose");

const Joi = require("joi");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", (error, data, next) => {
  error.status = 400;
  console.log(error);
  next();
});

const schema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ru"] } })
    .required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const updateFavoriteContact = Joi.object({
  favorite: Joi.boolean().required(),
});

const Contact = model("contact", contactSchema);

module.exports = {
  schema,
  updateFavoriteContact,
  Contact,
};
