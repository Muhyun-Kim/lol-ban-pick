"use server";

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
