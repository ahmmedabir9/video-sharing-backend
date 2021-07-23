const { StatusCodes } = require("http-status-codes");
const { Video } = require("../models/Video.model");
const { VideoComment } = require("../models/VideoComment.model");
const { VideoLike } = require("../models/VideoLike.model");
const { VideoShare } = require("../models/VideoShare.model");
const { response } = require("../utils/response");

//Create a Course
const createVideo = async (req, res) => {
  const { title, description, video, thumbnail, user, activeStatus } = req.body;

  if (!title || !description || !thumbnail || !video || !user) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Please Provide all information"
    );
  }

  const slug =
    title
      .replace(/\s+/g, "-")
      .replace(/\//g, "-")
      .replace(/&/g, "n")
      .toLowerCase() +
    "-" +
    Math.floor(Math.random() * 1000000000).toString(36) +
    Math.floor(Math.random() * 1000000000).toString(36) +
    Math.floor(Math.random() * 1000000000).toString(36);

  try {
    const newVideo = await Video.create({
      title: title,
      description: description,
      thumbnail: thumbnail,
      video: video,
      slug: slug,
      activeStatus: activeStatus,
      user: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!newVideo) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Could not create video"
      );
    }

    return response(res, StatusCodes.ACCEPTED, true, { video: newVideo }, null);
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

//Get All Courses
const getVideos = async (req, res) => {
  const { searchKey, user, sortBy, limit, skip } = req.body;

  try {
    const videosCount = await Video.countDocuments()
      .where(
        searchKey
          ? {
              $or: [
                {
                  title: { $regex: searchKey, $options: "i" },
                },
              ],
            }
          : null
      )
      .where(user ? { user: user } : null);

    const videos = await Video.find()
      .where(
        searchKey
          ? {
              $or: [
                {
                  title: { $regex: searchKey, $options: "i" },
                },
              ],
            }
          : null
      )
      .populate("user", "name email activeStatus photo")
      .where(user ? { user: user } : null)
      .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { createdAt: -1 })
      .limit(limit ? limit : null)
      .skip(skip ? skip : null);

    if (!videos || videos.length === 0) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "No videos Found");
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      { videosCount: videosCount, videos: videos },
      null
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

//Get Course Details
const getVideoDetails = async (req, res) => {
  const { slug } = req.params;

  try {
    const video = await Video.findOne({ slug: slug }).populate("course");

    if (!video) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "No video Found!");
    }

    return response(res, StatusCodes.OK, true, { video: video }, null);
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

//Like A Video
const likeVideo = async (req, res) => {
  const { user, video } = req.body;

  if (!video || !user) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Please Provide all information"
    );
  }

  try {
    const oldLike = await VideoLike.findOne({ video: video, user: user });

    if (oldLike) {
      return response(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        false,
        {},
        "Already Liked"
      );
    }

    const videoLike = await VideoLike.create({
      video: video,
      user: user,
      createdAt: new Date(),
    });

    if (!videoLike) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Could not create video"
      );
    }

    return response(res, StatusCodes.ACCEPTED, true, {}, "Liked");
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

//Unlike A Video
const unlikeVideo = async (req, res) => {
  const { user, video } = req.body;

  if (!video || !user) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Please Provide all information"
    );
  }

  try {
    const oldLike = await VideoLike.findOne({ video: video, user: user });

    if (!oldLike) {
      return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, "Not Liked");
    }

    const videoLike = await VideoLike.findByIdAndDelete(oldLike._id);

    if (!videoLike) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Could not unlike video"
      );
    }

    return response(res, StatusCodes.ACCEPTED, true, {}, "Unliked");
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

//Comment A Video
const commentOnVideo = async (req, res) => {
  const { user, video, text } = req.body;

  if (!video || !user || !text) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Please Provide all information"
    );
  }

  try {
    const videoComment = await VideoComment.create({
      video: video,
      user: user,
      text: text,
      createdAt: new Date(),
    });

    if (!videoComment) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Could not create video"
      );
    }

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { comment: videoComment },
      "Liked"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

//Reply Comment
const replyComment = async (req, res) => {
  const { user, video, text, parentComment } = req.body;

  if (!video || !user || !text || !parentComment) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Please Provide all information"
    );
  }

  try {
    const commentReply = await VideoComment.create({
      video: video,
      user: user,
      text: text,
      parentComment: parentComment,
      isReply: true,
      createdAt: new Date(),
    });

    if (!commentReply) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Could not create video"
      );
    }

    const videoComment = await VideoComment.findByIdAndUpdate(parentComment, {
      $push: { replys: commentReply._id },
      updatedAt: new Date(),
    });

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { comment: commentReply },
      "Liked"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

//Delete Comment

//Share Video
const shareVideo = async (req, res) => {
  const { user, video } = req.body;

  if (!video || !user) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Please Provide all information"
    );
  }

  try {
    const videoShare = await VideoShare.create({
      video: video,
      user: user,
      createdAt: new Date(),
    });

    if (!videoShare) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Could not create video"
      );
    }

    return response(res, StatusCodes.ACCEPTED, true, {}, "Shared");
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

//Get Likes, Comments, Share Counts

//Update Course
const updateVideo = async (req, res) => {
  const { title, description, thumbnail, activeStatus, chapterNumber } =
    req.body;

  const id = req.params.id;

  let video = {};

  if (title) {
    video.title = title;
  }
  if (description) {
    video.description = description;
  }
  if (thumbnail) {
    video.thumbnail = thumbnail;
  }
  if (chapterNumber) {
    video.chapterNumber = chapterNumber;
  }
  if (activeStatus !== null) {
    video.activeStatus = activeStatus;
  }

  if (video) {
    video.updatedAt = new Date();
    try {
      const newVideo = await Video.findByIdAndUpdate(id, video, {
        new: true,
      }).exec();
      if (!newVideo) {
        return response(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          {},
          "Could not update!"
        );
      }

      return response(
        res,
        StatusCodes.ACCEPTED,
        true,
        { video: newVideo },
        null
      );
    } catch (error) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        error.message
      );
    }
  } else {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Could not update!"
    );
  }
};

//Delete a Course
const deleteVideo = async (req, res) => {
  const id = req.params.id;

  try {
    const video = await Video.findByIdAndDelete(id);

    if (!video) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Could not delete!"
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      video.course,
      {
        $inc: { numberOfVideos: -1, duration: -video.duration },
        $pullAll: { videos: [video._id] },
      },
      { multi: true }
    );

    if (!updatedCourse) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Could not delete video"
      );
    }

    return response(res, StatusCodes.ACCEPTED, true, { video: video }, null);
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

//Get Course by package ID
const getVideoByUser = async (req, res) => {
  const { id } = req.params;

  const { searchKey, sortBy, limit, skip } = req.body;

  try {
    const videosCount = await Video.countDocuments({
      course: id,
      activeStatus: true,
    }).where(
      searchKey
        ? {
            $or: [
              {
                title: { $regex: searchKey, $options: "i" },
              },
            ],
          }
        : null
    );

    const videos = await Video.find({ course: id, activeStatus: true })
      .where(
        searchKey
          ? {
              $or: [
                {
                  title: { $regex: searchKey, $options: "i" },
                },
              ],
            }
          : null
      )
      .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { createdAt: -1 })
      .limit(limit ? limit : null)
      .skip(skip ? skip : null);

    if (!videos || videos.length === 0) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "No videos Found");
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      { videosCount: videosCount, videos: videos },
      null
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

module.exports = {
  createVideo,
  getVideos,
  getVideoDetails,
  updateVideo,
  deleteVideo,
  getVideoByUser,
};
