const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  timestamp: { type: Date, default: Date.now() },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Virtual for message's URL
MessageSchema.virtual("url").get(function () {
  return "/message/" + this._id;
});

//Export model
module.exports = mongoose.model("Message", MessageSchema);
