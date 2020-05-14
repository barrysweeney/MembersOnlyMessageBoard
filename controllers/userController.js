const User = require("../models/user");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");

// display user create on GET
exports.user_create_get = function (req, res) {
  res.render("sign-up", { errors: null, rerender: null });
};

// handle user create on POST
exports.user_create_post = [
  validator.body("forename").trim(),
  validator.body("surname").trim(),
  validator.body("username").trim(),
  // validate paswordConfirmation field using custom validator
  validator
    .check(
      "confirmPassword",
      "Password confirmation field must have the same value as the password field"
    )
    .custom((value, { req }) => value === req.body.password),
  // sanitize all fields
  validator.sanitizeBody("*").escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    // extract validation errors from request
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      // there are erros so re-render the form again with the sanitized values/ error messages
      res.render("sign-up", {
        user: req.body,
        errors: errors.array(),
        rerender: req.body,
      });
    } else {
      // create and save a user object with escaped data and hashed password and redirect to home page
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        const user = new User({
          forename: req.body.forename,
          surname: req.body.surname,
          username: req.body.username,
          password: hashedPassword,
        }).save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        });
      });
    }
  },
];

// handle user join on GET
exports.user_join_get = function (req, res) {
  res.render("join", { errors: null, user: req.user });
};

// handle user join on POST
exports.user_join_post = [
  // validate pasword field using custom validator
  validator
    .check(
      "password",
      "Password must match the secret password you were given when you logged in"
    )
    .custom((value) => value === "1234"),
  // process request after validation
  (req, res, next) => {
    // extract validation errors from request
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      // there are errors so re-render the form again with the error messages
      res.render("join", {
        errors: errors.array(),
        user: req.user,
      });
      return;
    } else {
      // password was correct, make the user a member
      User.findByIdAndUpdate(req.user._id, { member: true }, (err, doc) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];

// handle user register admin on GET
exports.user_admin_get = function (req, res) {
  res.render("register-admin", { errors: null, user: req.user });
};

// handle user register admin on POST
exports.user_admin_post = [
  // validate pasword field using custom validator
  validator
    .check("password", "Password incorrect")
    .custom((value) => value === process.env.ADMIN_PASSWORD),
  // process request after validation
  (req, res, next) => {
    // extract validation errors from request
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      // there are errors so re-render the form again with the error messages
      res.render("register-admin", {
        errors: errors.array(),
        user: req.user,
      });
      return;
    } else {
      // password was correct, make the user an admin
      User.findByIdAndUpdate(req.user._id, { admin: true }, (err, doc) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];
