import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const GET = async (
	request: Request,
	{ params }: { params: Promise<{ carId: string }> },
) => {
	try {
		const sessionOrResponse = await requireAuth();

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

		return new Response(JSON.stringify(car), {
			status: 200,
			headers: { "Content-type": "application.json" },
		});
	} catch (error) {
		console.error("🚀 ~ GET ~ error:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to get car",
				details: error instanceof Error ? error.message : error,
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
