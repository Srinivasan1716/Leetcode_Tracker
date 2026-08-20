import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import problemRoutes from "./routes/problem.route";
import userProblemRoutes from "./routes/userProblem.route";
import dashboardRoutes from "./routes/dashboard.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.use("/api/users", userRoutes);
app.use("/api/user-problems", userProblemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;