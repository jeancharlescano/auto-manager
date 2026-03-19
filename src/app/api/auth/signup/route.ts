import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (request: NextRequest) => {
	try {
		const body = await request.json();
		const existEmail = await prisma.user.findUnique({
			where: { email: body.email },
		});

		if (existEmail) {
			return new Response(
				JSON.stringify({
					error: "Email already exist",
				}),
				{
					status: 409,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const hashedPassword = await bcrypt.hash(body.password, 10);

		const newUser = await prisma.user.create({
			data: {
				firstname: body.firstname,
				lastname: body.lastname,
				email: body.email,
				password: hashedPassword,
				image: "imageUrl",
			},
		});

		console.log("🚀 ~ POST ~ newUser:", newUser);

		return new Response(
			JSON.stringify({
				message: "User created successfully",
			}),
			{
				status: 201,
			},
		);
	} catch (error: any) {
		console.error("🚀 ~ POST ~ error:", error);

		if (error.code === "P2002") {
			return new Response(JSON.stringify({ error: "Email already exists" }), {
				status: 409,
			});
		}

		return new Response(
			JSON.stringify({
				error: "Internal Server error",
				details: error instanceof Error ? error.message : error,
			}),
			{
				status: 500,
			},
		);
	}
};
