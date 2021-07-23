var { Schema, model, SchemaTypes } = require("mongoose");

//Video Like Schema
var VideoCommentSchema = Schema({
  video: {
    type: SchemaTypes.ObjectId,
    ref: "video",
  },
  user: {
    type: SchemaTypes.ObjectId,
    ref: "user",
  },
  text: {
    type: String,
    required: true,
  },
  replys: [
    {
      type: SchemaTypes.ObjectId,
      ref: "video_comment",
    },
  ],
  isReply: Boolean,
  //if isReply true
  parentComment: {
    type: SchemaTypes.ObjectId,
    ref: "video_comment",
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

const VideoComment = model("video_comment", VideoCommentSchema);

module.exports = { VideoComment };
