-- DropForeignKey
ALTER TABLE "ShopStaff" DROP CONSTRAINT "EmployedFor_fkey";

-- AddForeignKey
ALTER TABLE "ShopStaff" ADD CONSTRAINT "EmployedFor_fkey" FOREIGN KEY ("EmployedFor") REFERENCES "Shop"("ID") ON DELETE CASCADE ON UPDATE NO ACTION;
