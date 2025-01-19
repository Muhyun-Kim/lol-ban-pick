/*
  Warnings:

  - Added the required column `room_type` to the `BanPickRoom` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BanPickRoom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "room_type" TEXT NOT NULL,
    "room_name" TEXT NOT NULL,
    "room_owner" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_BanPickRoom" ("created_at", "id", "room_name", "room_owner") SELECT "created_at", "id", "room_name", "room_owner" FROM "BanPickRoom";
DROP TABLE "BanPickRoom";
ALTER TABLE "new_BanPickRoom" RENAME TO "BanPickRoom";
CREATE UNIQUE INDEX "BanPickRoom_room_name_key" ON "BanPickRoom"("room_name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
