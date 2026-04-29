import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
	try {
		const sessionOrResponse = await requireAuth();
		if (sessionOrResponse instanceof Response) {
			return sessionOrResponse;
		}

		const session = sessionOrResponse;

		const currentDate = new Date();
		const today = new Date(
			Date.UTC(
				currentDate.getFullYear(),
				currentDate.getMonth(),
				currentDate.getDate(),
			),
		);

		const cars = await prisma.car.findMany({
			where: { user_id: Number(session.user.id) },
			include: {
				maintenances: {
					where: {
						next_maintenance_date: {
							gte: today,
						},
					},
					orderBy: {
						next_maintenance_date: "asc",
					},
					take: 1,
					select: {
						id: true,
						title: true,
						next_maintenance_date: true,
					},
				},
			},
		});

		return new Response(JSON.stringify(cars), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.log("🚀 ~ GET ~ error:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to load cars",
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

		if (sessionOrResponse instanceof Response) {
			return sessionOrResponse;
		}
		const session = sessionOrResponse;

		const formData = await request.formData();

		const file = formData.get("image") as File;
		const uploadData = new FormData();
		uploadData.append("image", file);
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

		const newCar = await prisma.car.create({
			data: {
				license_plate: formData.get("licensePlate") as string,
				user_id: Number(session.user.id),
				brand: formData.get("brand") as string,
				model: formData.get("model") as string,
				year: Number(formData.get("year")),
				engine: formData.get("engine") as string,
				fuel_type: formData.get("fuelType") as string,
				horsepower_din: Number(formData.get("powerDin")),
				fiscal_power: Number(formData.get("powerFiscal")),
				mileage: Number(formData.get("mileage")),
				tire_size: formData.get("tireSize") as string,
				color: formData.get("color") as string,
				design: formData.get("design") as string,
				picture_url: data.files[0].url,
				picture_type: data.files[0].type,
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

export const DELETE = async (request: Request) => {
	try {
		const sessionOrResponse = await requireAuth();
		if (sessionOrResponse instanceof Response) {
			return sessionOrResponse;
		}

		const session = sessionOrResponse;
		const body = await request.json();

		for (const licensePlate of body.licensePlates) {
			const carInvoicesFiles = await prisma.invoice.findMany({
				where: {
					maintenances: {
						car_id: licensePlate,
					},
				},
				select: {
					file_url: true,
					type: true,
				},
			});

			for (const carInvoiceFile of carInvoicesFiles) {
				console.log("🏭 Suppression de : " + carInvoiceFile.file_url);
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_CDN_API_URL}/api/files`,
					{
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${process.env.CDN_TOKEN}`,
						},
						body: JSON.stringify({
							name: carInvoiceFile.file_url?.substring(
								carInvoiceFile.file_url.lastIndexOf("/") + 1,
							),
							type: carInvoiceFile.type,
						}),
					},
				);
				if (!res.ok) console.log("🟥 Fichier non supprimé => " + res.status);
				console.log("✅ Fichier supprimé");
			}

			const carImgs = await prisma.car.findMany({
				select: {
					picture_url: true,
					picture_type: true,
				},
				where: {
					license_plate: licensePlate,
				},
			});
			for (const carImg of carImgs) {
				console.log("🏭 Suppression de : " + carImg.picture_url);
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_CDN_API_URL}/api/files`,
					{
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${process.env.CDN_TOKEN}`,
						},
						body: JSON.stringify({
							name: carImg.picture_url?.substring(
								carImg.picture_url.lastIndexOf("/") + 1,
							),
							type: carImg.picture_type,
						}),
					},
				);
				if (!res.ok) console.log("🟥 Fichier non supprimé => " + res.status);
				console.log("✅ Fichier supprimé");
			}
		}
		console.log("🚀 ~ DELETE ~ body.licensePlates:", body.licensePlates);
		const deletedCar = await prisma.car.deleteMany({
			where: {
				user_id: Number(session.user.id),
				license_plate: {
					in: body.licensePlates,
				},
			},
		});
		return new Response(JSON.stringify(deletedCar), {
			status: 200,
		});
	} catch (error) {
		console.error("🚀 ~ DELETE ~ error:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to delete car",
				details: error instanceof Error ? error.message : error,
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
