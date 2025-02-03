"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface ChampionData {
  id: string;
  key: string;
  name: string;
  image: string;
  isBanned: boolean;
}

export function ChampionList() {
  const [championDataList, setChampionDataList] = useState<ChampionData[]>([]);
  const [filteredChampionDataList, setFilteredChampionDataList] = useState<
    ChampionData[]
  >([]);
  const [championName, setChampionName] = useState<string>("");
  const [banChamp, setBanChamp] = useState<string>("");

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
  }, []);
  return (
    <div className="flex flex-col items-center w-1/2 p-20 px-28 gap-12">
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
              // className={clsx("p-4 border", { "bg-blue-500 text-white": isActive, "bg-gray-200": !isActive })}
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
            prev.map((c) => (c.id === banChamp ? { ...c, isBanned: true } : c))
          );
          setFilteredChampionDataList((prev) =>
            prev.map((c) => (c.id === banChamp ? { ...c, isBanned: true } : c))
          );
        }}
      >
        <span>선택</span>
      </button>
    </div>
  );
}
