import { prisma } from "@/lib/prisma";

export const POST = async (request: Request) => {
	try {
		const body = await request.json();
		const newCar = await prisma.car.create({
			data: {
				user_id: 1,
				brand: body.brand,
				model: body.model,
				year: body.year,
				engine: body.engine,
				fuel_type: body.fuelType,
				horsepower_din: body.powerDin,
				fiscal_power: body.powerFiscal,
				mileage: body.mileage,
				tire_size: body.tireSize,
				color: body.color,
				design: body.design,
			},
		});
		return new Response(JSON.stringify(newCar), {
			status: 201,
			headers: { "Content-type": "application.json" },
		});
	} catch (error) {
		console.error("🚀 ~ POST ~ error:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to create car",
				details: error instanceof Error ? error.message : error,
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
