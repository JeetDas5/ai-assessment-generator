import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import { initializeSocket } from "./config/socket";
import "./workers/generation.worker";
import { connectDB } from "./config/db";

const server = http.createServer(app);

initializeSocket(server);

const PORT = process.env.PORT || 5000;

connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

