-- CreateTable
CREATE TABLE "BanPickRoom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "room_name" TEXT NOT NULL,
    "room_owner" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RoomUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "RoomUser_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "BanPickRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RoomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomUser_roomId_userId_key" ON "RoomUser"("roomId", "userId");
