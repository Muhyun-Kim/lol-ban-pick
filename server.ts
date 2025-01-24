import { Server } from "socket.io";
import * as http from "http";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit("userJoined", { userId: socket.id });
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    io.to(roomId).emit("userLeft", { userId: socket.id });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("WebSocket server is running on http://localhost:3001");
});
