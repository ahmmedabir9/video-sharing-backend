var { Schema, model, SchemaTypes } = require("mongoose");

//Video Schema
var VideoSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  video: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  duration: {
    type: Number, //in second
  },
  user: {
    type: SchemaTypes.ObjectId,
    ref: "user",
  },
  activeStatus: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

const Video = model("video", VideoSchema);

module.exports = { Video };
