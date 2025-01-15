"use client";

import { ChangeEvent, useState } from "react";
import { getPuuid, GetPuuidRes } from "./actions";
import { FormInput } from "@/components/input";

export function TestBtn() {
  const [account, setAccount] = useState<GetPuuidRes | null>(null);
  const [gameName, setGameName] = useState<string>("");
  const [tagLine, setTagLine] = useState<string>("");
  const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "gameName") {
      setGameName(value);
    } else if (name === "tagLine") {
      setTagLine(value);
    }
  };
  const onClick = async () => {
    const data = await getPuuid({ gameName, tagLine });
    console.log(data);
    setAccount(data);
  };
  return (
    <div className="flex flex-col w-1/6 gap-4">
      <input name="gameName" value={gameName} onChange={changeInput} />
      <input name="tagLine" value={tagLine} onChange={changeInput} />
      <button onClick={onClick}>test1</button>
      {account && <h1>{account.gameName}</h1>}
    </div>
  );
}
