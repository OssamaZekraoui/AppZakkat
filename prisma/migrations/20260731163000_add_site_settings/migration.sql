CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "nisabType" "NisabType" NOT NULL DEFAULT 'GOLD',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "site_settings" ("id", "nisabType", "updatedAt")
VALUES ('global', 'GOLD', CURRENT_TIMESTAMP);
