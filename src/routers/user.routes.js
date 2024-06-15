import { Router } from "express";
import {
  changePassword,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/update").patch(verifyJwt, updateUser);
router.route("/pchange").patch(verifyJwt, changePassword);
export default router;
