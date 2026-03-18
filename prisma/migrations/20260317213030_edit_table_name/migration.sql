-- CreateTable
CREATE TABLE "car" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "brand" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "year" INTEGER NOT NULL,
    "engine" VARCHAR(255),
    "fuel_type" VARCHAR(50),
    "horsepower_din" INTEGER,
    "fiscal_power" INTEGER,
    "mileage" INTEGER,
    "tire_size" VARCHAR(50),
    "color" VARCHAR(50),
    "design" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" SERIAL NOT NULL,
    "maintenance_id" INTEGER NOT NULL,
    "invoice_number" VARCHAR(255),
    "issue_date" DATE,
    "total_amount" DECIMAL(10,2),
    "file_url" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_part" (
    "id" SERIAL NOT NULL,
    "maintenance_id" INTEGER NOT NULL,
    "part_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(10,2),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "maintenance_date" DATE NOT NULL,
    "mileage_at_time" INTEGER NOT NULL,
    "total_cost" DECIMAL(10,2),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "part" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "reference" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(255) NOT NULL,
    "email_verified" TIMESTAMP(6),
    "password" VARCHAR(255) NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "car" ADD CONSTRAINT "car_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "maintenance"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "maintenance_part" ADD CONSTRAINT "maintenance_part_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "maintenance"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "maintenance_part" ADD CONSTRAINT "maintenance_part_part_id_fkey" FOREIGN KEY ("part_id") REFERENCES "part"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "maintenance" ADD CONSTRAINT "maintenance_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
