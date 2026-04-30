import { prisma } from "@/lib/prisma";
import {
	createPasswordResetToken,
	getPasswordResetExpirationDate,
	hashPasswordResetToken,
} from "@/lib/passwordReset";
import { sendPasswordResetEmail } from "@/lib/passwordResetEmail";
import { NextRequest, NextResponse } from "next/server";

const successMessage =
	"Si un compte existe avec cette adresse email, un lien de réinitialisation a été envoyé.";

export const POST = async (request: NextRequest) => {
	try {
		const body = await request.json();
		const email =
			typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

		if (!email) {
			return NextResponse.json(
				{ error: "Adresse email obligatoire." },
				{ status: 400 },
			);
		}

		const user = await prisma.user.findUnique({
			where: { email },
			select: { id: true, email: true },
		});

		if (!user) {
			return NextResponse.json({ message: successMessage });
		}

		await prisma.$executeRaw`
			DELETE FROM password_reset_token
			WHERE user_id = ${user.id}
			OR expires_at < ${new Date()}
		`;

		const token = createPasswordResetToken();
		const tokenHash = hashPasswordResetToken(token);
		const expiresAt = getPasswordResetExpirationDate();

		await prisma.$executeRaw`
			INSERT INTO password_reset_token (user_id, token_hash, expires_at)
			VALUES (${user.id}, ${tokenHash}, ${expiresAt})
		`;

		const baseUrl = process.env.NEXTAUTH_URL ?? request.nextUrl.origin;
		const resetUrl = `${baseUrl}/reset-password?token=${token}`;
		const emailResult = await sendPasswordResetEmail({
			to: user.email,
			resetUrl,
		});
		const shouldShowResetUrl =
			!emailResult.sent && process.env.NODE_ENV !== "production";

		return NextResponse.json({
			message: successMessage,
			resetUrl: shouldShowResetUrl ? resetUrl : undefined,
		});
	} catch (error) {
		console.error("Erreur forgot-password:", error);

		return NextResponse.json(
			{ error: "Impossible de traiter la demande pour le moment." },
			{ status: 500 },
		);
	}
};
