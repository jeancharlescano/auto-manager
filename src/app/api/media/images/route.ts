import { requireAuth } from "@/lib/auth";

const getCdnToken = async () => {
	const res = await fetch(`${process.env.CDNAPIURL}/api/auth/sign-in/email`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: process.env.CDNEMAIL,
			password: process.env.CDNPASSWORD,
		}),
	});

	if (!res.ok) {
		throw new Error("CDN auth failed");
	}

	const data = await res.json();
	return data.token;
};

export const POST = async (request: Request) => {
	try {
		const sessionOrResponse = await requireAuth();

		if (sessionOrResponse instanceof Response) {
			return sessionOrResponse;
		}

		const token = await getCdnToken();

		const response = await fetch(`${process.env.CDNAPIURL}/api/upload`, {
			method: "POST",
			body: request.body,
			headers: {
				"Content-Type": request.headers.get("content-type") || "",
				Authorization: `Bearer ${token}`,
			},
		});

		return new Response(response.body, {
			status: response.status,
			headers: response.headers,
		});
	} catch (error) {
		console.error("🚀 ~ POST ~ error:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
};
