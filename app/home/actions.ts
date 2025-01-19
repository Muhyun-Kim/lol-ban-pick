"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const base_url = "https://asia.api.riotgames.com";
const riotApi = process.env.RIOT_API_KEY;

export interface GetPuuidReq {
  gameName: string;
  tagLine: string;
}

export interface GetPuuidRes {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export async function getPuuid({
  gameName,
  tagLine,
}: GetPuuidReq): Promise<GetPuuidRes | null> {
  if (!riotApi) {
    throw new Error("Riot API Key is not defined");
  }

  const url = `${base_url}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
    gameName
  )}/${encodeURIComponent(tagLine)}?api_key=${riotApi}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Riot API error: ${response.statusText}`);
      return null;
    }

    const data = (await response.json()) as GetPuuidRes;
    return data;
  } catch (error) {
    console.error("Failed to fetch Riot API:", error);
    return null;
  }
}

export async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
    notFound();
  }
}

export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/login");
};

const makeRoomSchema = z.object({
  banPickType: z.string({ required_error: "Ban pick type is required" }),
});

export const makeRoom = async (prevstate: any, formData: FormData) => {
  const data = {
    banPickType: formData.get("ban-pick-type"),
  };
  const validationResult = await makeRoomSchema.safeParseAsync(data);
  if (!validationResult.success) {
    const err = validationResult.error.flatten();
    return err;
  } else {
    const roomName = uuidv4();
    redirect(
      `/waiting-room?room_id=${roomName}&room_type=${validationResult.data.banPickType}`
    );
  }
};
