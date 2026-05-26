import cors from "cors";
import express from "express";
import assignmentRoutes from "./routes/assignment.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Welcome to AI Assignment Generator");
});

app.use("/api/assignments", assignmentRoutes);

export default app;
