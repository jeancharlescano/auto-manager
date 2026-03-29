import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	try {
		const sessionOrResponse = await requireAuth();

		if (sessionOrResponse instanceof Response) {
			return sessionOrResponse;
		}
		const { maintenanceId, carId } = await req.json();

		const car = await prisma.car.findUnique({
			where: {
				license_plate: carId,
				user_id: Number(sessionOrResponse.user.id),
			},
		});

		if (!car) {
			return new Response("Car not found", { status: 404 });
		}
		const maintenance = await prisma.maintenance.findUnique({
			where: { id: maintenanceId },
			include: { car: true, invoices: true },
		});
		if (!maintenance) {
			return new Response(
				JSON.stringify({ message: "Maintenance not found" }),
				{ status: 404 },
			);
		}

		if (
			maintenance.car.license_plate !== carId ||
			maintenance.car.user_id !== Number(sessionOrResponse.user.id)
		) {
			return new Response(JSON.stringify({ message: "Access refused" }), {
				status: 403,
			});
		}

		const invoices = maintenance.invoices
			.filter((invoice) => invoice.file_url)
			.map((invoice) => {
				const folder = invoice.type?.startsWith("application/")
					? "document"
					: invoice.type?.split("/")[0];
				const pathPart = invoice.file_url!.split("/");
				return { folder, name: pathPart[pathPart.length - 1] };
			});

		const res = await fetch(
			`${process.env.NEXT_PUBLIC_CDN_API_URL}/api/download/batch`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.CDN_TOKEN}`,
				},
				body: JSON.stringify({ files: invoices }),
			},
		);
		if (!res.ok) {
			const data = await res.json(); // si le CDN renvoie du JSON
			const errorMessage = data.message || JSON.stringify(data);
			return new Response(JSON.stringify({ message: errorMessage }), {
				status: res.status,
				headers: { "Content-Type": "application/json" },
			});
		}
		return new Response(res.body, {
			headers: {
				"Content-Type": "application/zip",
				"Content-Disposition": 'attachment; filename="download.zip"',
			},
		});
	} catch (error) {
		console.error("🚀 ~ POST ~ error:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to download files",
				details: error instanceof Error ? error.message : error,
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
