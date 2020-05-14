const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  forename: { type: String, required: true },
  surname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  member: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
});

// Virtual for users's URL
UserSchema.virtual("url").get(function () {
  return "/user/" + this._id;
});

//Export model
module.exports = mongoose.model("User", UserSchema);
