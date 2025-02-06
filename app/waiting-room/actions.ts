"use server";

import db from "@/lib/db";
import { Participant } from "./page";
import { z } from "zod";

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

const inputUserToRoomSchema = z.object({
  roomName: z.string(),
  participants: z
    .array(
      z.object({
        userId: z.number(),
        team: z.enum(["red", "blue"]),
      })
    )
    .superRefine((participants, ctx) => {
      if (participants.length > 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 2,
          type: "array",
          inclusive: true,
          message: "Participants array must have at least 2 members",
        });
      }
    }),
});

interface InputUserToRoomParams {
  roomName: string;
  participants: Participant[];
}
export const inputUserToRoom = async ({
  roomName,
  participants,
}: InputUserToRoomParams) => {
  const validationResult = inputUserToRoomSchema.safeParse({
    roomName,
    participants,
  });
  if (!validationResult.success) {
    return null;
  }
  try {
    const room = await db.banPickRoom.findUnique({
      where: {
        room_name: validationResult.data.roomName,
      },
      select: {
        id: true,
      },
    });
    if (!room) {
      return null;
    }
    const result = await db.roomUser.createMany({
      data: validationResult.data.participants.map((p) => ({
        user_id: p.userId,
        room_id: room.id,
        team: p.team,
      })),
    });
    return room.id;
  } catch (e) {
    console.error(e);
    return null;
  }
};
