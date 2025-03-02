import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import recipeRouter from "./routes/recipeRoutes.js";
import authRouter from "./routes/authRoutes.js";

//App config
const app = express();
const port = process.env.PORT || 5000;
connectDb();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors());

//api endpoints

app.get("/", (req, res) => {
  res.send("API working");
});
app.use("/api/users", userRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log("server started on port " + port);
});
