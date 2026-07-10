-- CreateTable
CREATE TABLE "AdminSeen" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminSeen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminSeen_userId_section_key" ON "AdminSeen"("userId", "section");
