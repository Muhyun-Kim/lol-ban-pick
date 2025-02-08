"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { User } from "@prisma/client";
import { getUser } from "../home/actions";
import { useSearchParams } from "next/navigation";
import { getRoomInfo } from "./actions";

interface ChampionData {
  id: string;
  key: string;
  name: string;
  image: string;
  isBanned: boolean;
}

export function ChampionList() {
  const searchParams = useSearchParams();
  const banPickRoomId = searchParams.get("ban_pick_room_id");
  const [user, setUser] = useState<User | null>(null);
  const [ownerId, setOwnerId] = useState<number | null>(null);

  const [championDataList, setChampionDataList] = useState<ChampionData[]>([]);
  const [filteredChampionDataList, setFilteredChampionDataList] = useState<
    ChampionData[]
  >([]);
  const [championName, setChampionName] = useState<string>("");
  const [banChamp, setBanChamp] = useState<string>("");
  const [redBanChamps, setRedBanChamps] = useState<string[]>([]);
  const [blueBanChamps, setBlueBanChamps] = useState<string[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setChampionName(e.target.value);
  };

  useEffect(() => {
    const filteredChampionList = championDataList.filter((champion) =>
      champion.name.toLowerCase().includes(championName.toLowerCase())
    );
    setFilteredChampionDataList(filteredChampionList);
  }, [championName]);

  useEffect(() => {
    const fetchChampionData = async () => {
      const response = await fetch("/dragon/data/ko_KR/championFull.json");
      const data = await response.json();
      const championList = Object.values(data.data)
        .map((champion: any) => {
          return {
            id: champion.id,
            key: champion.key,
            name: champion.name,
            image: champion.image.full,
            isBanned: false,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
      setChampionDataList(championList);
      setFilteredChampionDataList(championList);
    };
    fetchChampionData();
    const fetchRoomInfo = async () => {
      const fetchedUser = await getUser();
      if (!fetchedUser) {
        alert("로그인이 필요합니다.");
        return;
      }
      setUser(fetchedUser);
      if (!banPickRoomId || !Number(banPickRoomId)) {
        alert("방 정보가 없습니다.");
        return;
      }
      const fetchedRoomInfo = await getRoomInfo(Number(banPickRoomId));
      if (!fetchedRoomInfo) {
        alert("방 정보가 없습니다.");
        return;
      }
      const roomOwnerId = fetchedRoomInfo.roomInfo.room_owner;
      setOwnerId(roomOwnerId);
    };
    fetchRoomInfo();
  }, []);
  const count = [1, 2, 3, 4, 5];
  return (
    <div className="flex h-full w-full justify-center pt-20 items-center gap-10">
      <div
        id="my-team"
        className="flex flex-col justify-around w-1/6 max-h-[650px] min-h-[650px]"
      >
        {count.map((i) => (
          <div className="flex justify-between items-center my-4 p-4 w-full border-2 border-white">
            <Image
              alt={"garen"}
              src={`/dragon/img/champion/Garen.png`}
              width={60}
              height={60}
              className="rounded-full border-2"
            />
            <h1>name</h1>
          </div>
        ))}
      </div>
      <div id="champ-pick" className="flex flex-col items-center w-1/2 gap-12">
        <input
          name="championName"
          value={championName}
          onChange={onChange}
          className="text-black"
        />
        <div className="w-full max-h-[650px] min-h-[650px] p-4 grid grid-cols-6 gap-2 gap-y-8 justify-items-center border-2 overflow-y-auto border-white">
          {filteredChampionDataList.map((championData) => {
            return (
              <div
                key={championData.id}
                role="button"
                className={clsx(
                  "h-22 w-22 flex flex-col items-center gap-2 transition duration-300 hover:brightness-50",
                  {
                    "brightness-50":
                      championData.id === banChamp || championData.isBanned,
                  }
                )}
                id={championData.id}
                onClick={() => {
                  setBanChamp(championData.id);
                }}
              >
                <Image
                  alt={championData.name}
                  src={`/dragon/img/champion/${championData.image}`}
                  width={60}
                  height={60}
                />
                <h6>{championData.name}</h6>
              </div>
            );
          })}
        </div>
        <button
          className="bg-blue-500 text-white p-2 rounded-md w-80"
          onClick={() => {
            setChampionDataList((prev) =>
              prev.map((c) =>
                c.id === banChamp ? { ...c, isBanned: true } : c
              )
            );
            setFilteredChampionDataList((prev) =>
              prev.map((c) =>
                c.id === banChamp ? { ...c, isBanned: true } : c
              )
            );
          }}
        >
          <span>선택</span>
        </button>
      </div>
      <div
        id="enemy-team"
        className="flex flex-col justify-around w-1/6 max-h-[650px] min-h-[650px]"
      >
        {count.map((i) => (
          <div className="flex justify-between items-center my-4 p-4 w-full border-2 border-white">
            <Image
              alt={"garen"}
              src={`/dragon/img/champion/Garen.png`}
              width={60}
              height={60}
              className="rounded-full border-2"
            />
            <h1>name</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
