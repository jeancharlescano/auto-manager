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

export const PATCH = async (
	request: Request,
	{ params }: { params: Promise<{ carId: string }> },
) => {
	try {
		const sessionOrResponse = await requireAuth();

		if (sessionOrResponse instanceof Response) {
			return sessionOrResponse;
		}
		const session = sessionOrResponse;

		const { carId } = await params;

		const formData = await request.formData();

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

			if (!uploadRes.ok) {
				return new Response(JSON.stringify({ error: "Image upload failed" }), {
					status: 502,
				});
			}
			imageData = await uploadRes.json();
		}

		const updateData: any = {};

		if (formData.has("brand"))
			updateData.brand = formData.get("brand") as string;
		if (formData.has("model"))
			updateData.model = formData.get("model") as string;
		if (formData.has("year")) updateData.year = Number(formData.get("year"));
		if (formData.has("engine"))
			updateData.engine = formData.get("engine") as string;
		if (formData.has("fuelType"))
			updateData.fuel_type = formData.get("fuelType") as string;
		if (formData.has("powerDin"))
			updateData.horsepower_din = Number(formData.get("powerDin"));
		if (formData.has("powerFiscal"))
			updateData.fiscal_power = Number(formData.get("powerFiscal"));
		if (formData.has("mileage"))
			updateData.mileage = Number(formData.get("mileage"));
		if (formData.has("tireSize"))
			updateData.tire_size = formData.get("tireSize") as string;
		if (formData.has("color"))
			updateData.color = formData.get("color") as string;
		if (formData.has("design"))
			updateData.design = formData.get("design") as string;

		if (imageData?.files?.[0]) {
			updateData.picture_url = imageData.files[0].url;
			updateData.picture_type = imageData.files[0].type;
		}

		if (Object.keys(updateData).length === 0) {
			return new Response(JSON.stringify({ error: "No fields to update" }), {
				status: 400,
			});
		}

		const updatedCar = await prisma.car.update({
			where: {
				license_plate: carId,
				user_id: Number(session.user.id),
			},
			data: updateData,
		});

		return new Response(JSON.stringify(updatedCar), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("🚀 ~ PATCH ~ error:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to update car",
				details: error instanceof Error ? error.message : error,
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
