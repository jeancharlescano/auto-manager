import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const GET = async (_request: Request) => {
	try {
		const sessionOrResponse = await requireAuth();
		if (sessionOrResponse instanceof Response) {
			return sessionOrResponse;
		}

		const session = sessionOrResponse;

		const cars = await prisma.car.findMany({
			where: { user_id: Number(session.user.id) },
		});

		return new Response(JSON.stringify(cars), {
			status: 200,
			headers: { "Content-type": "application.json" },
		});
	} catch (error) {
		console.log("🚀 ~ GET ~ error:", error);
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
export const POST = async (request: Request) => {
	try {
		const sessionOrResponse = await requireAuth();
		console.log("🚀 ~ POST ~ sessionOrResponse:", sessionOrResponse);

		if (sessionOrResponse instanceof Response) {
			return sessionOrResponse;
		}

		const session = sessionOrResponse;

		const body = await request.json();
		const newCar = await prisma.car.create({
			data: {
				license_plate: body.licensePlate,
				user_id: Number(session.user.id),
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
				picture_url: body.pictureUrl,
			},
		});
		return new Response(JSON.stringify(newCar), {
			status: 201,
			headers: { "Content-type": "application/json" },
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
