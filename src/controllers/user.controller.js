import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "Email or username already exists");
  }
  const createdUser = await User.create({ username, email, password });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if ([username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!user.isCorrectPassword(password)) {
    throw new ApiError(401, "Invalid credentials");
  }
  console.log(user._id);
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  const loggedInUser = await User.findOne(user._id).select("-password");
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
};

const updateUser = async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "All fields are required");
  }
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { username, email },
    { new: true }
  ).select("-password");

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Updated successfully"));
};

const changePassword = async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;
    console.log(typeof oldpassword, typeof newpassword);
    if (!oldpassword || !newpassword) {
      throw new ApiError(400, "All fields are required");
    }
    const user = await User.findById(req.user._id);
    const isPasswordCorrect = user.isCorrectPassword(oldpassword);
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid credentials");
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { newpassword },
      { new: true }
    );

    if (!updatedUser) {
      throw new ApiError(500, "Something went wrong while updating the user");
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "User updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while updating the user");
  }
};
export { registerUser, loginUser, updateUser, changePassword };
