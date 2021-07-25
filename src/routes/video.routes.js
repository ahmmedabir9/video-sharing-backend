const { Router } = require("express");
const {
  createVideo,
  getVideos,
  getVideoDetails,
  updateVideo,
  getVideoByUser,
  deleteVideo,
  likeVideo,
  unlikeVideo,
  commentOnVideo,
  replyComment,
  deleteComment,
  shareVideo,
  getLikeCommentShareCounts,
  getComments,
} = require("../controllers/video.controller");

const router = Router();

//api: url/video/__

//Video
router.post("/create", createVideo);
router.post("/", getVideos);
router.post("/user/:id", getVideoByUser);
router.put("/update/:id", updateVideo);
router.get("/:slug", getVideoDetails);
router.post("/delete/:id", deleteVideo);
router.post("/like", likeVideo);
router.post("/unlike", unlikeVideo);
router.post("/comment", commentOnVideo);
router.post("/reply", replyComment);
router.post("/delete-comment", deleteComment);
router.post("/share", shareVideo);
router.get("/like-comment-share-count/:id", getLikeCommentShareCounts);
router.get("/get-comments/:id", getComments);

module.exports = router;
