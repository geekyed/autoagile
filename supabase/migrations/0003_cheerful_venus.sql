ALTER TABLE "prices" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

CREATE VIEW tariffs AS SELECT DISTINCT octopus_tariff FROM profile;

