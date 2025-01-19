/*
  Warnings:

  - The primary key for the `RoomUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RoomUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[room_name]` on the table `BanPickRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RoomUser" (
    "roomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "RoomUser_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "BanPickRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RoomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RoomUser" ("roomId", "userId") SELECT "roomId", "userId" FROM "RoomUser";
DROP TABLE "RoomUser";
ALTER TABLE "new_RoomUser" RENAME TO "RoomUser";
CREATE UNIQUE INDEX "RoomUser_roomId_userId_key" ON "RoomUser"("roomId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "BanPickRoom_room_name_key" ON "BanPickRoom"("room_name");
