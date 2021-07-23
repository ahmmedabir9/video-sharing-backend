var { Schema, model, SchemaTypes } = require("mongoose");

//Video Like Schema
var VideoLikeSchema = Schema({
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

const VideoLike = model("video_like", VideoLikeSchema);

module.exports = { VideoLike };
