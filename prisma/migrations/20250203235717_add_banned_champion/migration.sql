-- CreateTable
CREATE TABLE "BannedChampion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ChampId" TEXT NOT NULL,
    "team" TEXT,
    "room_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "BannedChampion_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "BanPickRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BannedChampion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BannedChampion_room_id_user_id_fkey" FOREIGN KEY ("room_id", "user_id") REFERENCES "RoomUser" ("room_id", "user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RoomUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "room_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "team" TEXT,
    "round_number" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "RoomUser_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "BanPickRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RoomUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RoomUser" ("id", "room_id", "team", "user_id") SELECT "id", "room_id", "team", "user_id" FROM "RoomUser";
DROP TABLE "RoomUser";
ALTER TABLE "new_RoomUser" RENAME TO "RoomUser";
CREATE UNIQUE INDEX "RoomUser_room_id_user_id_key" ON "RoomUser"("room_id", "user_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "BannedChampion_room_id_user_id_key" ON "BannedChampion"("room_id", "user_id");
