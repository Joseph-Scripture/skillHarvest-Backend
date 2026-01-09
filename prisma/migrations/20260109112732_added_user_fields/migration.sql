-- AlterTable
ALTER TABLE "User" ADD COLUMN     "farmLocation" TEXT,
ADD COLUMN     "farmType" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "experience" DROP NOT NULL,
ALTER COLUMN "experience" DROP DEFAULT,
ALTER COLUMN "experience" SET DATA TYPE TEXT;
