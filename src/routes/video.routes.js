const { Router } = require("express");
const {
  createVideo,
  getVideos,
  getVideoDetails,
  updateVideo,
  getVideoByUser,
  deleteVideo,
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

module.exports = router;
