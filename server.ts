import { Server } from "socket.io";
import * as http from "http";
import {
  ChangeTeam,
  JoinRoomReq,
  Participant,
  StartBanPick,
} from "./app/waiting-room/page";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export interface UserLeftReq {
  socketId: string;
}

export interface UserJoinedReq {
  joinedParticipants: Participant;
}

const rooms: { [key: string]: Participant[] } = {};

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("joinRoom", ({ roomId, participant }: JoinRoomReq) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    } else {
      const isExist = rooms[roomId].some(
        (p) => p.userId === participant.userId
      );
      if (!isExist) {
        participant.socketId = socket.id;
        const isRedMore =
          rooms[roomId].filter((p) => p.team == "red").length >
          rooms[roomId].filter((p) => p.team == "blue").length;
        participant.team = isRedMore ? "blue" : "red";
        rooms[roomId].push(participant);
      }
    }
    socket.join(roomId);
    io.to(roomId).emit("userJoined", { joinedParticipants: rooms[roomId] });
    console.log("rooms", rooms);
  });

  socket.on("changeTeam", ({ roomId, user, team }: ChangeTeam) => {
    if (roomId && user) {
      const updateRooms = rooms[roomId].map((p) => {
        if (p.userId === user.id && p.team !== team) {
          return { ...p, team };
        }
        return p;
      });
      rooms[roomId] = updateRooms;
      io.to(roomId).emit("userJoined", { joinedParticipants: rooms[roomId] });
    }
  });

  socket.on("startBanPick", ({ roomId }: StartBanPick) => {
    io.to(roomId).emit("banPickStarted");
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((p) => p.socketId !== socket.id);
      io.to(roomId).emit("userLeft", { socketId: socket.id } as UserLeftReq);
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
