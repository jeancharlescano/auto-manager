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

export const PUT = async (request: Request) => {
	try {
		const sessionOrResponse = await requireAuth();

		if (sessionOrResponse instanceof Response) {
			return sessionOrResponse;
		}
		const session = sessionOrResponse;

		const formData = await request.formData();
		for (let pair of formData.entries()) {
			console.log(pair[0] + " => " + pair[1]);
		}

		let imageData = null;
		if (formData.has("image")) {
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
			imageData = await uploadRes.json();
		}

		const updateCar = await prisma.car.update({
			where: {
				license_plate: formData.get("licensePlate") as string,
			},
			data: {
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

				...(imageData?.files?.[0] && {
					picture_url: imageData.files[0].url,
					picture_type: imageData.files[0].type,
				}),
			},
		});

		return new Response(JSON.stringify(updateCar), {
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
