-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ZakatSchool" AS ENUM ('HANAFI', 'MALIKI', 'SHAFIITE', 'HANBALITE');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ZAKAT', 'PERSONAL', 'MEDICAL', 'RELIGIOUS', 'ASSOCIATION', 'HUMANITARIAN', 'EDUCATION', 'FUNERAL', 'EID', 'ORPHANS');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'REVIEW', 'PUBLISHED', 'REJECTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE_CARD', 'PAYPAL', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "NisabType" AS ENUM ('GOLD', 'SILVER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "country" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'ar',
    "currency" TEXT NOT NULL DEFAULT 'MAD',
    "zakatSchool" "ZakatSchool" NOT NULL DEFAULT 'MALIKI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleFr" TEXT,
    "descriptionAr" TEXT NOT NULL,
    "targetAmount" DECIMAL(65,30) NOT NULL,
    "currentAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" "RequestStatus" NOT NULL DEFAULT 'DRAFT',
    "iban" TEXT NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "deadline" TIMESTAMP(3),
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "documents" JSONB NOT NULL DEFAULT '[]',
    "verifications" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_updates" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "contentAr" TEXT NOT NULL,
    "contentFr" TEXT,
    "photos" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_donations" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "method" "PaymentMethod" NOT NULL,
    "stripePaymentIntent" TEXT,
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "receiptNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zakat_calculations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "nisabType" "NisabType" NOT NULL,
    "goldPrice" DECIMAL(65,30) NOT NULL,
    "silverPrice" DECIMAL(65,30) NOT NULL,
    "totalAssets" DECIMAL(65,30) NOT NULL,
    "debts" DECIMAL(65,30) NOT NULL,
    "netAssets" DECIMAL(65,30) NOT NULL,
    "zakatAmount" DECIMAL(65,30) NOT NULL,
    "hawlStart" TIMESTAMP(3) NOT NULL,
    "hawlEnd" TIMESTAMP(3) NOT NULL,
    "school" "ZakatSchool" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zakat_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zakat_items" (
    "id" TEXT NOT NULL,
    "calculationId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "amountBase" DECIMAL(65,30) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "zakat_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "requests_referenceCode_key" ON "requests"("referenceCode");

-- CreateIndex
CREATE UNIQUE INDEX "site_donations_receiptNumber_key" ON "site_donations"("receiptNumber");

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_updates" ADD CONSTRAINT "request_updates_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_donations" ADD CONSTRAINT "site_donations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zakat_calculations" ADD CONSTRAINT "zakat_calculations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zakat_items" ADD CONSTRAINT "zakat_items_calculationId_fkey" FOREIGN KEY ("calculationId") REFERENCES "zakat_calculations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
