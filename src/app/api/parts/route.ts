import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
	try {
		const sessionOrResponse = await requireAuth();

		if (sessionOrResponse instanceof Response) {
			return sessionOrResponse;
		}

		const session = sessionOrResponse;

		const parts = await prisma.part.findMany();

		return new Response(JSON.stringify(parts), {
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
