import cors from "cors";
import express from "express";
import assignmentRoutes from "./routes/assignment.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Welcome to AI Assignment Generator");
});

app.use("/api/auth", userRoutes);
app.use("/api/assignments", assignmentRoutes);

export default app;
