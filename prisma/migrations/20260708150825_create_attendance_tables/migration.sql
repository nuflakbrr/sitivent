-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL,
    "registration_id" TEXT,
    "scan_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scanner_id" TEXT,
    "status" "AttendanceStatus" NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_scanner_id_fkey" FOREIGN KEY ("scanner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
