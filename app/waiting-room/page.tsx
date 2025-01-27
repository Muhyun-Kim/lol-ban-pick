"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { checkRoomId, getRoomOwner } from "./actions";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function WaitingRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isConnected, setIsConnected] = useState(false);

  const roomName = searchParams.get("room_id");
  const roomType = searchParams.get("room_type");
  const [copied, setCopied] = useState(false);
  const [roomOwner, setRoomOwner] = useState<string>("");

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
      }
    };
    checkRoomValid();
    socket = io("http://localhost:3001");
    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
      setIsConnected(true);
    });
    socket.emit("joinRoom", roomName);

    socket.on("userJoined", (data) => {
      console.log("user joined", data);
    });

    socket.on("userLeft", ({ userId }) => {
      console.log("user left", userId);
    });

    socket.on("test", (data) => {
      console.log(data);
    });

    return () => {
      socket.emit("leaveRoom", roomName);
      socket.disconnect();
    };
  }, []);

  const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWebsocket = () => {
    if (isConnected) {
      socket.emit("test", { test: "test" });
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
      <button onClick={handleWebsocket}>test</button>
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
