dotenv.config({ path: "./.env" });
import dotenv from "dotenv";
import connectDb from "./db/index.js";
import { app } from "./app.js";

try {
  connectDb()
    .then(() => {
      app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
      });
    })
    .catch((err) => {
      console.log("Mongodb Connection Error: " + err);
    });
} catch (error) {
  console.log(error);
}
