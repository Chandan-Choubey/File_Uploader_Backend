import mongoose, { Schema } from "mongoose";

const VideoSchema = Schema({
  videoFile: {
    type: String,
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Video = mongoose.model("Video", VideoSchema);
