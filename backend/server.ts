import http from "http";
import app from "./app";
import { Server } from "socket.io";
import "./workers/generation.worker";
import { connectDB } from "./config/db";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


const PORT = process.env.PORT || 5000;

connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
