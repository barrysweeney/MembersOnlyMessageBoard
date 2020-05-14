const Message = require("../models/message");
const validator = require("express-validator");

// display message create form on GET
exports.message_create_get = function (req, res) {
  res.render("new-message", { user: req.user });
};

// handle message create on POST
exports.message_create_post = [
  validator.body("title").trim(),
  validator.body("content").trim(),
  // sanitize all fields
  validator.sanitizeBody("*").escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    // create a message object with escaped data and hashed password
    const message = new Message({
      title: req.body.title,
      content: req.body.content,
      author: req.user,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
];

// handle message delete on GET
exports.message_delete_get = function (req, res, next) {
  if (req.user && req.user.admin) {
    Message.findByIdAndDelete(req.params.id, function (err, result) {
      if (err) {
        return next(err);
      }
    });
  }
  res.redirect("/");
};
