import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import conversationRoute from "./routes/conversation.route.js";
import auth from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import lawyerrouter from "./routes/lawyer.route.js";
import adminRouter from "./routes/adminRouter.js";
import lawrouter from "./routes/lawyer.route.js";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", auth);
app.use("/api/users", userRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/adminRouter", adminRouter);
app.use("/api",lawrouter);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!....";

  return res.status(errorStatus).send(errorMessage);
});

app.listen(5000, () => {
  connect();
  console.log("Backend server is running!...");
});
