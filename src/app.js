import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

import userRouter from "./routers/user.routes.js";
import videoRouter from "./routers/video.routes.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videoRouter);

export { app };
