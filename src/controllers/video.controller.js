import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadCloudinary } from "../utils/Cloudinary.js";
import { User } from "../models/user.model.js";

const uploadVideo = async (req, res) => {
  const { emailTo } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailTo) {
    throw new ApiError(400, "To field is required");
  }

  if (!emailRegex.test(emailTo)) {
    throw new ApiError(400, "Invalid email format");
  }

  const videoLocalPath = req.file?.path;
  console.log(videoLocalPath);
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file path not found");
  }

  const videoOnCloudinary = await uploadCloudinary(videoLocalPath);
  console.log(videoOnCloudinary);
  if (!videoOnCloudinary) {
    throw new ApiError(400, "Video not uploaded on cloudinary server");
  }

  const to = await User.findOne({ email: emailTo });
  if (!to) {
    throw new ApiError(404, "Recevier mail not found");
  }
  const video = await Video.create({
    videoFile: videoOnCloudinary.url,
    to,
    from: req.user,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Sent Successfully"));
};

const getvideoFromColudinary = async (req, res) => {
  const videos = await Video.find({ to: req.user._id });
  if (!videos) {
    throw new ApiError(404, "Videos not found");
  }
  res.status(200).json(new ApiResponse(200, videos, "Video Sent Successfully"));
};
export { uploadVideo, getvideoFromColudinary };
