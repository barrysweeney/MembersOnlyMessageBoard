const express = require("express");
const router = express.Router();
const async = require("async");
const passport = require("passport");
const Message = require("../models/message");

const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

// GET home page
router.get("/", function (req, res, next) {
  async.parallel(
    {
      messages: function (callback) {
        Message.find({}, callback).populate("author");
      },
    },
    function (err, results) {
      res.render("index", {
        error: err,
        messages: results.messages,
        user: req.user,
      });
    }
  );
});

// GET request for creating a user
router.get("/user/create", user_controller.user_create_get);

// POST request for creating user
router.post("/user/create", user_controller.user_create_post);

// POST request for logging in
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

// GET request for logging out
router.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

// GET request for becoming a member
router.get("/user/join", user_controller.user_join_get);

// POST request for becoming a member
router.post("/user/join", user_controller.user_join_post);

// GET request for becoming an admin
router.get("/user/register-admin", user_controller.user_admin_get);

// POST request for becoming an admin
router.post("/user/register-admin", user_controller.user_admin_post);

// GET request for creating message
router.get("/message/create", message_controller.message_create_get);

// POST request for creating message
router.post("/message/create", message_controller.message_create_post);

// GET request for deleting a message
router.get("/message/:id/delete", message_controller.message_delete_get);

module.exports = router;
