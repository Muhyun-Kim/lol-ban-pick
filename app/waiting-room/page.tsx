"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getRoomOwner } from "./actions";
import { io, Socket } from "socket.io-client";
import { User } from "@prisma/client";
import { getUser } from "../home/actions";

// let socket: Socket;

interface Participant {
  userId: number;
  name: string;
  team: "red" | "blue";
  socketId?: string;
}

interface UserJoinedEvent {
  joinedUser: Participant;
}

export default function WaitingRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isConnected, setIsConnected] = useState(false);

  const roomName = searchParams.get("room_id");
  const roomType = searchParams.get("room_type");
  const [copied, setCopied] = useState(false);
  const [roomOwner, setRoomOwner] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const checkRoomValid = async () => {
      if (!roomName || !roomType) {
        router.back();
        alert("invalid room id");
      } else {
        const res = await getRoomOwner({ roomId: roomName, roomType });
        if (!res) {
          router.back();
          alert("invalid room id");
        }
        setRoomOwner(res!.owner.account);
        const user = await getUser();
        if (user) {
          setUser(user);
        }
        const socket = io("http://localhost:3001");
        socketRef.current = socket;
        socket.on("connect", () => {
          setIsConnected(true);
        });
        const participant: Participant = {
          userId: user?.id!,
          name: user?.account!,
          team: "red",
        };
        socket.emit("joinRoom", { roomId: roomName, participant });

        socket.on("userJoined", (data: Participant[]) => {
          console.log("userJoined", data);
          setParticipants(data);
        });

        socket.on("userLeft", ({ userSocketId }) => {
          console.log("userLeft", userSocketId);
          setParticipants((prev) =>
            prev.filter((p) => p.socketId !== userSocketId)
          );
          console.log("participants", participants);
        });

        return () => {
          if (socketRef.current) {
            socketRef.current.emit("leaveRoom", roomName);
            socketRef.current.disconnect();
          }
        };
      }
    };
    checkRoomValid();
  }, []);

  useEffect(() => {
    console.log("now participants:", participants);
  }, [participants]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (roomName) {
        console.log(`Leaving room: ${roomName}`);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomName]);

  const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const leaveRoom = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("leaveRoom", roomName);
      socketRef.current.disconnect();
    } else {
      console.error("Socket is not initialized or not connected!");
    }
  };

  const handleExitRoom = () => {
    if (isConnected) {
      leaveRoom();
      router.back();
    }
  };

  return (
    <div className="h-screen flex flex-col items-center pt-24 gap-4">
      <span className="text-4xl">Waiting Room</span>
      <div className="flex items-center gap-4">
        <button onClick={handleCopyUrl}>copy url and share</button>
      </div>
      {copied && <span>room number copied clipboard</span>}
      <div id="team" className="flex w-1/2 justify-between mt-10">
        <div id="blue" className="flex flex-col gap-4 w-2/5">
          <UserBox name="user1" />
          <UserBox name="user2" />
          <UserBox name="user3" />
          <UserBox name="user4" />
          <UserBox name="user5" />
        </div>
        <div id="red" className="flex flex-col gap-4 w-2/5">
          <UserBox name="user1" />
          <UserBox name="user2" />
          <UserBox name="user3" />
          <UserBox name="user4" />
          <ParticipantBox />
        </div>
      </div>
      <button onClick={handleExitRoom}>방 나가기</button>
    </div>
  );
}

interface UserBoxProps {
  name: string;
}

function UserBox({ name }: UserBoxProps) {
  return (
    <div className="flex h-16 w-full items-center px-8 border border-gray-400 rounded-lg">
      <span>{name}</span>
    </div>
  );
}

function ParticipantBox() {
  return (
    <div className="flex h-16 w-full items-center justify-end px-8 border border-gray-400 rounded-lg">
      <button className="py-1 px-2 border bg-gray-300 border-gray-400 rounded-lg text-black hover:bg-gray-400">
        참가
      </button>
    </div>
  );
}
