import { Server } from "socket.io";
import http from "http";

let io: Server | null = null;

export const initializeSocket = (server: http.Server): Server => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected to socket:", socket.id);

    socket.on("join-assignment", (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);
      console.log(
        `Socket ${socket.id} joined assignment room: assignment:${assignmentId}`,
      );
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io is not initialized yet!");
  }
  return io;
};

export const notifyAssignmentUpdate = (
  assignmentId: string,
  status: string,
  data?: any,
) => {
  if (io) {
    io.to(`assignment:${assignmentId}`).emit("assignment-updated", {
      assignmentId,
      status,
      ...data,
    });
  } else {
    console.warn(
      "Socket.io is not initialized. Cannot emit assignment status update.",
    );
  }
};
