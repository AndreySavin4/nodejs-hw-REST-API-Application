const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers");
const { User, registerSchema, rLoginSchema } = require("../models/user");
const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const { error } = registerSchema.validate(req.body);
  if (error) {
    next(HttpError(400, error.message));
    // return res.status(400).json({
    //   message: error.message,
    // });
  }
  if (user) {
    next(HttpError(409, "Email in use"));
    // return res.status(409).json({
    //   message: "Email in use",
    // });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const loginIn = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const { error } = rLoginSchema.validate(req.body);
  if (error) {
    // next(HttpError(400, error.message));
    return res.status(400).json({
      message: error.message,
    });
  }
  if (!user) {
    next(HttpError(401, "Email or password is wrong"));
    // return res.status(401).json({ message: "Email or password is wrong" });
  }
  const result = await bcrypt.compare(password, user.password);

  if (!result) {
    next(HttpError(401, "Email or password is wrong"));
    // return res.status(401).json({ message: "Email or password is wrong" });
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    email: User.email,
    subscription: User.subscription,
  });
};

const current = async (req, res, next) => {
  const { email, subscription } = req.user;
  try {
    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    next(HttpError(401));
  }
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  try {
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204);
  } catch (error) {
    next(HttpError(401));
  }
};

module.exports = {
  register,
  loginIn,
  current,
  logout,
};
