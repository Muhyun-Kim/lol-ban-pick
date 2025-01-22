"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ChampionData {
  id: string;
  key: string;
  name: string;
  image: string;
}

export function ChampionList() {
  const [championDataList, setChampionDataList] = useState<ChampionData[]>([]);
  const [filteredChampionDataList, setFilteredChampionDataList] = useState<
    ChampionData[]
  >([]);
  const [championName, setChampionName] = useState<string>("");
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
      <div className="w-full grid grid-cols-6 gap-2 gap-y-8 justify-items-center">
        {filteredChampionDataList.map((championData) => {
          return (
            <div
              key={championData.id}
              className="h-22 w-22 flex flex-col items-center gap-2"
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
    </div>
  );
}
