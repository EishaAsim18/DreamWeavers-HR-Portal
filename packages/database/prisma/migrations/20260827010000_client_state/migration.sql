-- CreateTable
CREATE TABLE "client_states" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_states_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_states_organizationId_scope_key_key" ON "client_states"("organizationId", "scope", "key");

-- CreateIndex
CREATE INDEX "client_states_organizationId_scope_idx" ON "client_states"("organizationId", "scope");

-- AddForeignKey
ALTER TABLE "client_states" ADD CONSTRAINT "client_states_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
