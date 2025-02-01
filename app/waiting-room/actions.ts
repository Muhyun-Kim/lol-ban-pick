"use server";

import db from "@/lib/db";
import { Participant } from "./page";

interface CheckRoomIdParams {
  roomId: string;
  roomType: string;
}

export const checkRoomId = async ({ roomId, roomType }: CheckRoomIdParams) => {
  const room = await db.banPickRoom.findUnique({
    where: {
      room_name: roomId,
      room_type: roomType,
    },
    select: {
      id: true,
    },
  });
  console.log(room);
  return Boolean(room);
};

export const getRoomOwner = async ({ roomId, roomType }: CheckRoomIdParams) => {
  try {
    const roomInfo = await db.banPickRoom.findUnique({
      where: {
        room_name: roomId,
        room_type: roomType,
      },
      select: {
        room_name: true,
        room_type: true,
        owner: {
          select: {
            account: true,
          },
        },
      },
    });
    return roomInfo;
  } catch (e) {
    console.error(e);
    return null;
  }
};

interface InputUserToRoomParams {
  roomName: string;
  participants: Participant[];
}
export const inputUserToRoom = async ({
  roomName,
  participants,
}: InputUserToRoomParams) => {
  console.log("start inputUserToRoom");
  try {
    const room = await db.banPickRoom.findUnique({
      where: {
        room_name: roomName,
      },
      select: {
        id: true,
      },
    });
    if (!room) {
      return null;
    }
    const result = await db.roomUser.createMany({
      data: participants.map((p) => ({
        user_id: p.userId,
        room_id: room.id,
        team: p.team,
      })),
    });
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
};
