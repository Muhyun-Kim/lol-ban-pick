"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getRoomOwner, inputUserToRoom } from "./actions";
import { io, Socket } from "socket.io-client";
import { User } from "@prisma/client";
import { getUser } from "../home/actions";
import { UserLeftReq } from "@/server";

export type Team = "blue" | "red";

export interface Participant {
  userId: number;
  name: string;
  team?: Team;
  socketId?: string;
}

export interface JoinRoomReq {
  roomId: string;
  participant: Participant;
}

export interface ChangeTeam {
  roomId?: string;
  user?: User;
  team: Team;
}

export interface StartBanPick {
  roomId: string;
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
        const socket = io("http://localhost:3001/waiting-room");
        socketRef.current = socket;
        socket.on("connect", () => {
          setIsConnected(true);
        });
        const participant: Participant = {
          userId: user?.id!,
          name: user?.account!,
        };
        socket.emit("joinRoom", {
          roomId: roomName,
          participant,
        } as JoinRoomReq);

        socket.on("userJoined", (data) => {
          setParticipants(data.joinedParticipants);
        });

        socket.on("banPickStarted", () => {
          router.push(`/ban-pick?room_id=${roomName}&room_type=${roomType}`);
        });

        socket.on("userLeft", (data: UserLeftReq) => {
          console.log("userLeft", data.socketId);

          setParticipants((prev) => {
            if (!Array.isArray(prev)) {
              console.error("Participants state is not an array:", prev);
              return prev;
            }

            return prev.filter((p) => p.socketId !== data.socketId);
          });
        });

        return () => {
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
        };
      }
    };
    checkRoomValid();
  }, []);

  const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const leaveRoom = () => {
    if (socketRef.current && isConnected) {
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

  const onClickParticipantBtn = (team: Team) => {
    console.log("참가 버튼 클릭");

    if (socketRef.current && isConnected && user) {
      socketRef.current.emit("changeTeam", {
        roomId: roomName,
        user,
        team,
      } as ChangeTeam);
    } else {
      console.error("Socket is not initialized or not connected!");
    }
  };

  const startBanPick = async () => {
    if (!roomName) {
      alert("invalid room id");
    }
    const result = await inputUserToRoom({ roomName: roomName!, participants });
    if (!result) {
      alert("failed to input user to room");
      return;
    }
    socketRef.current?.emit("startBanPick", {
      roomId: roomName,
    } as StartBanPick);
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
          <span>Blue Team</span>
          {participants
            .filter((p) => p.team === "blue")
            .map((p) => (
              <UserBox key={p.name} name={p.name} />
            ))}
          {Array.from(
            {
              length: 5 - participants.filter((p) => p.team === "blue").length,
            },
            (_, i) => (
              <ParticipantBox
                key={`blue-${i}`}
                onClickParticipantBtn={() => onClickParticipantBtn("blue")}
              />
            )
          )}
        </div>
        <div id="red" className="flex flex-col gap-4 w-2/5">
          <span>Red Team</span>
          {participants
            .filter((p) => p.team === "red")
            .map((p) => (
              <UserBox key={p.name} name={p.name} />
            ))}
          {Array.from(
            {
              length: 5 - participants.filter((p) => p.team === "red").length,
            },
            (_, i) => (
              <ParticipantBox
                key={`red-${i}`}
                onClickParticipantBtn={() => {
                  onClickParticipantBtn("red");
                }}
              />
            )
          )}
        </div>
      </div>
      <button onClick={handleExitRoom}>방 나가기</button>
      {roomOwner === user?.account && (
        <button onClick={startBanPick}>밴픽시작</button>
      )}
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

interface ParticipantBoxProps {
  onClickParticipantBtn: () => void;
}

function ParticipantBox({ onClickParticipantBtn }: ParticipantBoxProps) {
  return (
    <div className="flex h-16 w-full items-center justify-end px-8 border border-gray-400 rounded-lg">
      <button
        className="py-1 px-2 border bg-gray-300 border-gray-400 rounded-lg text-black hover:bg-gray-400"
        onClick={onClickParticipantBtn}
      >
        참가
      </button>
    </div>
  );
}
