import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LeetCode Tracker Backend Running 🚀");
});

app.use("/api/users", userRoutes);

export default app;