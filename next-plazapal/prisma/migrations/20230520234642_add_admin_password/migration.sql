-- CreateTable
CREATE TABLE "Admin" (
    "ID" BIGSERIAL NOT NULL,
    "Email" VARCHAR(50) NOT NULL,
    "Name" VARCHAR(50) NOT NULL,
    "Surname" VARCHAR(50) NOT NULL,
    "TelephoneNo" VARCHAR(20) NOT NULL,
    "isMallOwner" BOOLEAN NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Branch" (
    "ID" BIGSERIAL NOT NULL,
    "Location" VARCHAR(50) NOT NULL,
    "DateOpened" DATE NOT NULL,
    "ManagedBy" BIGINT NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "ShopOwner" (
    "ID" BIGSERIAL NOT NULL,
    "Email" VARCHAR(50) NOT NULL,
    "Name" VARCHAR(50) NOT NULL,
    "Surname" VARCHAR(50) NOT NULL,
    "TelephoneNo" VARCHAR(20) NOT NULL,

    CONSTRAINT "ShopOwner_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Shop" (
    "ID" BIGSERIAL NOT NULL,
    "Sector" VARCHAR(50) NOT NULL,
    "Name" VARCHAR(50) NOT NULL,
    "OwnedBy" BIGINT NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Space" (
    "ID" BIGSERIAL NOT NULL,
    "Location" VARCHAR(50) NOT NULL,
    "Floor" VARCHAR(20) NOT NULL,
    "BranchID" BIGINT NOT NULL,
    "AreaSquareMeter" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "OccupiedSpace" (
    "SpaceID" BIGINT NOT NULL,
    "DateOpened" DATE NOT NULL,
    "OpenTime" TIME(6) NOT NULL,
    "CloseTime" TIME(6) NOT NULL,
    "ShopID" BIGINT NOT NULL,

    CONSTRAINT "OccupiedSpace_pkey" PRIMARY KEY ("SpaceID")
);

-- CreateTable
CREATE TABLE "Contract" (
    "ID" BIGSERIAL NOT NULL,
    "StartDate" DATE NOT NULL,
    "EndDate" DATE NOT NULL,
    "Fee" BIGINT NOT NULL,
    "PaymentFrequency" VARCHAR(20) NOT NULL,
    "SpaceID" BIGINT NOT NULL,
    "OwnerID" BIGINT NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "ContractPayment" (
    "ContractID" BIGINT NOT NULL,
    "PaymentID" BIGINT NOT NULL,
    "AmountPaid" BIGINT,
    "Timestamp" TIMESTAMP(6),
    "ExpectedDate" DATE NOT NULL,

    CONSTRAINT "ContractPayment_pkey" PRIMARY KEY ("ContractID","PaymentID")
);

-- CreateTable
CREATE TABLE "MallStaff" (
    "ID" BIGSERIAL NOT NULL,
    "Email" VARCHAR(50) NOT NULL,
    "Name" VARCHAR(50) NOT NULL,
    "Surname" VARCHAR(50) NOT NULL,
    "TelephoneNo" VARCHAR(20) NOT NULL,
    "StartDate" DATE NOT NULL,
    "Salary" BIGINT NOT NULL,
    "AssignedTo" BIGINT NOT NULL,

    CONSTRAINT "MallStaff_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "ShopStaff" (
    "ID" BIGSERIAL NOT NULL,
    "Email" VARCHAR(50) NOT NULL,
    "Name" VARCHAR(50) NOT NULL,
    "Surname" VARCHAR(50) NOT NULL,
    "TelephoneNo" VARCHAR(20) NOT NULL,
    "WorksAt" BIGINT NOT NULL,
    "EmployedFor" BIGINT NOT NULL,

    CONSTRAINT "ShopStaff_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "ID" BIGSERIAL NOT NULL,
    "SpaceID" BIGINT NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "SensorData" (
    "SensorID" BIGINT NOT NULL,
    "Timestamp" TIMESTAMP(6) NOT NULL,
    "DetectionCount" BIGINT NOT NULL,

    CONSTRAINT "SensorData_pkey" PRIMARY KEY ("SensorID","Timestamp")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branch_ManagedBy_key" ON "Branch"("ManagedBy");

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "ManagedBy_fkey" FOREIGN KEY ("ManagedBy") REFERENCES "Admin"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "OwnedBy_fkey" FOREIGN KEY ("OwnedBy") REFERENCES "ShopOwner"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "BranchID_fkey" FOREIGN KEY ("BranchID") REFERENCES "Branch"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OccupiedSpace" ADD CONSTRAINT "ShopID_fkey" FOREIGN KEY ("ShopID") REFERENCES "Shop"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OccupiedSpace" ADD CONSTRAINT "SpaceID_fkey" FOREIGN KEY ("SpaceID") REFERENCES "Space"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "OwnerID_fkey" FOREIGN KEY ("OwnerID") REFERENCES "ShopOwner"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "SpaceID_fkey" FOREIGN KEY ("SpaceID") REFERENCES "Space"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ContractPayment" ADD CONSTRAINT "ContractID_fkey" FOREIGN KEY ("ContractID") REFERENCES "Contract"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MallStaff" ADD CONSTRAINT "AssignedTo_fkey" FOREIGN KEY ("AssignedTo") REFERENCES "Branch"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ShopStaff" ADD CONSTRAINT "EmployedFor_fkey" FOREIGN KEY ("EmployedFor") REFERENCES "Shop"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ShopStaff" ADD CONSTRAINT "WorksAt_fkey" FOREIGN KEY ("WorksAt") REFERENCES "OccupiedSpace"("SpaceID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "SpaceID_fkey" FOREIGN KEY ("SpaceID") REFERENCES "OccupiedSpace"("SpaceID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SensorData" ADD CONSTRAINT "SensorID_fkey" FOREIGN KEY ("SensorID") REFERENCES "Sensor"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;
