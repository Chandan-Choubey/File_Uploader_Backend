import mongoose from "mongoose";
const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );
    console.log(
      "Mongo DB Connected Successfully",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("Mongo DB Connection Error: " + error);
    return error;
  }
};
export default connectDb;
