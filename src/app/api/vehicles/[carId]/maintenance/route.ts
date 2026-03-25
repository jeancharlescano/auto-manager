import { Prisma } from "@/generated/prisma/client";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MaintenancePartForm } from "@/types/maintenance";

export const POST = async (
	request: Request,
	{ params }: { params: Promise<{ carId: string }> },
) => {
	try {
		const sessionOrResponse = await requireAuth();

		if (sessionOrResponse instanceof Response) {
			return sessionOrResponse;
		}

		const body = await request.json();
		const { carId } = await params;

		const car = await prisma.car.findUnique({
			where: {
				license_plate: carId,
				user_id: Number(sessionOrResponse.user.id),
			},
		});

		if (!car) {
			return new Response("Car not found", { status: 404 });
		}

		const newMaintenance = await prisma.maintenance.create({
			data: {
				car_id: carId,
				title: body.title,
				maintenance_date: new Date(body.date),
				mileage_at_time: Number(body.mileage),
				total_cost: new Prisma.Decimal(body.totalPrice),
				maintenance_parts: {
					create: body.parts.map((part: MaintenancePartForm) => ({
						quantity: Number(part.quantity),
						unit_price: new Prisma.Decimal(part.price),
						parts: {
							connectOrCreate: {
								where: {
									name: part.name.trim().toLowerCase(),
								},
								create: {
									name: part.name.trim().toLowerCase(),
								},
							},
						},
					})),
				},
			},
		});

		return new Response(JSON.stringify(newMaintenance), {
			status: 201,
			headers: { "Content-type": "application/json" },
		});
	} catch (error) {
		console.error("🚀 ~ POST ~ error:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to create maintenance",
				details: error instanceof Error ? error.message : error,
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};

export const GET = async (
	request: Request,
	{ params }: { params: Promise<{ carId: string }> },
) => {
	try {
		const sessionOrResponse = await requireAuth();
		console.log("🚀 ~ POST ~ sessionOrResponse:", sessionOrResponse);

		if (sessionOrResponse instanceof Response) {
			return sessionOrResponse;
		}

		const { carId } = await params;

		const car = await prisma.car.findUnique({
			where: {
				license_plate: carId,
				user_id: Number(sessionOrResponse.user.id),
			},
		});

		if (!car) {
			return new Response("Car not found", { status: 404 });
		}

		const maintenances = await prisma.maintenance.findMany({
			where: { car_id: carId },
		});

		return new Response(JSON.stringify(maintenances), {
			status: 200,
			headers: { "Content-type": "application.json" },
		});
	} catch (error) {
		console.error("🚀 ~ GET ~ error:", error);
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
