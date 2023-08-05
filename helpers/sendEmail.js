const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASS } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "andreysavin4@meta.ua",
    pass: META_PASS,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "andreysavin4@meta.ua" };
  await transporter.sendMail(email);
  return true;
};

module.exports = sendEmail;
