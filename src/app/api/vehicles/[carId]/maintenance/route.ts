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

		const formData = await request.formData();
		const images = formData.getAll("image");
		const files = formData.getAll("file");

		const uploadData = new FormData();
		images.forEach((img) => {
			uploadData.append("image", img);
		});
		files.forEach((file) => {
			uploadData.append("file", file);
		});
		// Appel api d'upload d'image
		const uploadRes = await fetch(
			`${process.env.NEXT_PUBLIC_CDN_API_URL}/api/upload`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.CDN_TOKEN}`,
				},
				body: uploadData,
			},
		);
		const data = await uploadRes.json();
		const invoices = [];
		for (const file of data.files) {
			invoices.push(file);
		}

		const newMaintenance = await prisma.maintenance.create({
			data: {
				car_id: carId,
				title: formData.get("title") as string,
				maintenance_date: new Date(formData.get("date") as string),
				mileage_at_time: Number(formData.get("mileage")),
				total_cost: new Prisma.Decimal(formData.get("totalPrice") as string),
				maintenance_parts: {
					create: JSON.parse(formData.get("parts") as string).map(
						(part: MaintenancePartForm) => ({
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
						}),
					),
				},
				invoices: {
					create: invoices.map((invoice) => ({
						file_url: invoice.url,
						type: invoice.type,
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
