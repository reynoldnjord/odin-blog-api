const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

exports.signup = [
  body("username")
    .trim()
    .escape()
    .custom(async (username) => {
      try {
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) throw new Error("username already in use");
      } catch (err) {
        throw new Error(err);
      }
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Minimum length 6 characters"),
  body("confirm-password").custom((value, { req }) => {
    if (value !== req.password) {
      return next("Passwords do not match");
    }
    return true;
  }),

  async (req, res, next) => {
    const errors = validationResult(req);

    passport.authenticate("signup", { session: false }, (err, user, info) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({
          username: req.body.username,
          errors: errors.array(),
        });
      }
      if (err) return next(err);
      res.json({
        message: "signed-up successfully",
        user: req.user,
      });
    });
  },
];

exports.login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occured");
        returnnext(err);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, username: user.username };
        const token = jwt.sign({ user: body }, process.env, SECRET_KEY, {
          expiresIn: "1d",
        });
      });
    } catch (err) {
      return next(err);
    }
  });
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
