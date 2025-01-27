import { Server } from "socket.io";
import * as http from "http";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
interface Participant {
  userId: number;
  name: string;
  team: "red" | "blue";
  socketId?: string;
}

interface JoinRoomPayload {
  roomId: string;
  participant: Participant;
}

const rooms: { [key: string]: Participant[] } = {};

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("joinRoom", ({ roomId, participant }: JoinRoomPayload) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    } else {
      const isExist = rooms[roomId].some(
        (p) => p.userId === participant.userId
      );
      if (!isExist) {
        participant.socketId = socket.id;
        rooms[roomId].push(participant);
      }
    }
    socket.join(roomId);
    io.to(roomId).emit("userJoined", { participants: rooms[roomId] });
    console.log("rooms", rooms);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    rooms[roomId] = rooms[roomId].filter((p) => p.socketId !== socket.id);
    io.to(roomId).emit("userLeft", { userId: socket.id });
    if (rooms[roomId].length === 0) {
      delete rooms[roomId];
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((p) => p.socketId !== socket.id);
      io.to(roomId).emit("userLeft", { userId: socket.id });
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }
    console.log("left rooms", rooms);
  });
});

server.listen(3001, () => {
  console.log("WebSocket server is running on http://localhost:3001");
});
