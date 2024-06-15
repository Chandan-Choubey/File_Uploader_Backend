import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  getvideoFromColudinary,
  uploadVideo,
} from "../controllers/video.controller.js";

const router = Router();
router.use(verifyJwt);

router.route("/upload").post(upload.single("video"), uploadVideo);
router.route("/video").get(getvideoFromColudinary);

export default router;
