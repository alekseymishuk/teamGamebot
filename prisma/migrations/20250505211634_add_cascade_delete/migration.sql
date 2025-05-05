-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_guesserId_fkey";

-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_targetId_fkey";

-- AlterTable
ALTER TABLE "Guess" ALTER COLUMN "guesserId" SET DATA TYPE TEXT,
ALTER COLUMN "targetId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_guesserId_fkey" FOREIGN KEY ("guesserId") REFERENCES "Participant"("telegramId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Participant"("telegramId") ON DELETE CASCADE ON UPDATE CASCADE;
