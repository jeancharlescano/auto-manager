import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const DELETE = async (
	request: Request,
	{ params }: { params: Promise<{ maintenanceId: string; carId: string }> },
) => {
	try {
		const sessionOrResponse = await requireAuth();

		if (sessionOrResponse instanceof Response) {
			return sessionOrResponse;
		}
		const { carId, maintenanceId } = await params;

		const car = await prisma.car.findUnique({
			where: {
				license_plate: carId,
				user_id: Number(sessionOrResponse.user.id),
			},
		});

		if (!car) {
			return new Response("Car not found", { status: 404 });
		}
		const invoicesLinked = await prisma.invoice.findMany({
			where: {
				maintenance_id: Number(maintenanceId),
			},
		});
		for (const invoiceLinked of invoicesLinked) {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_CDN_API_URL}/api/files`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${process.env.CDN_TOKEN}`,
					},
					body: JSON.stringify({
						name: invoiceLinked.file_url?.substring(
							invoiceLinked.file_url.lastIndexOf("/") + 1,
						),
						type: invoiceLinked.type,
					}),
				},
			);

			const data = await res.json();
			if (data.error) {
				return new Response(JSON.stringify({ error: "erreur de suppresion" }), {
					status: 500,
					headers: { "Content-Type": "application/json" },
				});
			}
		}
		const deleteMaintenance = await prisma.maintenance.delete({
			where: {
				id: Number(maintenanceId),
			},
		});

		return new Response(JSON.stringify(deleteMaintenance), {
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
