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
		let imageUrl = data.files[0].url;

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
				picture_url: imageUrl,
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
