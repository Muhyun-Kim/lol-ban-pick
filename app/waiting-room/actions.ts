"use server";

import db from "@/lib/db";

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
