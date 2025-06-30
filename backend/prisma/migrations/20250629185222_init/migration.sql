-- CreateTable
CREATE TABLE "SimulationInput" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "numChargePoints" INTEGER NOT NULL,
    "arrivalProbabilityMult" INTEGER NOT NULL DEFAULT 100,
    "carConsumption" DOUBLE PRECISION NOT NULL DEFAULT 18,
    "chargingPower" DOUBLE PRECISION NOT NULL DEFAULT 11,

    CONSTRAINT "SimulationInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationResult" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "simulationInputId" INTEGER NOT NULL,
    "chargingValues" JSONB NOT NULL,
    "exemplaryDay" TIMESTAMP(3) NOT NULL,
    "totalEnergyCharged" DOUBLE PRECISION NOT NULL,
    "chargingEventsPerYear" INTEGER NOT NULL,
    "chargingEventsPerMonth" INTEGER NOT NULL,
    "chargingEventsPerWeek" INTEGER NOT NULL,
    "chargingEventsPerDay" INTEGER NOT NULL,

    CONSTRAINT "SimulationResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SimulationResult" ADD CONSTRAINT "SimulationResult_simulationInputId_fkey" FOREIGN KEY ("simulationInputId") REFERENCES "SimulationInput"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
