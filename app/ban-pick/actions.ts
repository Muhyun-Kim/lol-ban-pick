"use server";

import db from "@/lib/db";

export const getRoomInfo = async (roomId: number) => {
  try {
    const roomInfo = await db.banPickRoom.findUnique({
      where: { id: roomId },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!roomInfo) throw new Error("Room not found");

    const roomUsers = roomInfo.users;

    return { roomInfo, roomUsers };
  } catch (e) {
    return null;
  }
};
