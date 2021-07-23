var { Schema, model, SchemaTypes } = require("mongoose");

//Video Like Schema
var VideoShareSchema = Schema({
  video: {
    type: SchemaTypes.ObjectId,
    ref: "video",
  },
  user: {
    type: SchemaTypes.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
  },
});

const VideoShare = model("video_share", VideoShareSchema);

module.exports = { VideoShare };
