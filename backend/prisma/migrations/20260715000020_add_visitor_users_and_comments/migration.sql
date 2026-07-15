-- CreateTable
CREATE TABLE "visitor_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectSlug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitorId" INTEGER NOT NULL,
    CONSTRAINT "comments_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitor_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "visitor_users_email_key" ON "visitor_users"("email");

-- CreateIndex
CREATE INDEX "comments_projectSlug_status_idx" ON "comments"("projectSlug", "status");
