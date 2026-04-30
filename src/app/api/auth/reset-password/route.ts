import { prisma } from "@/lib/prisma";
import { hashPasswordResetToken } from "@/lib/passwordReset";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

type ResetTokenRow = {
	id: number;
	user_id: number;
	expires_at: Date;
	used_at: Date | null;
};

export const POST = async (request: NextRequest) => {
	try {
		const body = await request.json();
		const token = typeof body.token === "string" ? body.token.trim() : "";
		const password = typeof body.password === "string" ? body.password : "";

		if (!token || !password) {
			return NextResponse.json(
				{ error: "Token et mot de passe obligatoires." },
				{ status: 400 },
			);
		}

		if (password.length < 8) {
			return NextResponse.json(
				{ error: "Le mot de passe doit contenir au moins 8 caractères." },
				{ status: 400 },
			);
		}

		const tokenHash = hashPasswordResetToken(token);
		const resetTokens = await prisma.$queryRaw<ResetTokenRow[]>`
			SELECT id, user_id, expires_at, used_at
			FROM password_reset_token
			WHERE token_hash = ${tokenHash}
			LIMIT 1
		`;
		const resetToken = resetTokens[0];

		if (!resetToken || resetToken.used_at || resetToken.expires_at < new Date()) {
			return NextResponse.json(
				{ error: "Ce lien est invalide ou a expiré." },
				{ status: 400 },
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.$transaction([
			prisma.user.update({
				where: { id: resetToken.user_id },
				data: { password: hashedPassword },
			}),
			prisma.$executeRaw`
				UPDATE password_reset_token
				SET used_at = ${new Date()}
				WHERE id = ${resetToken.id}
			`,
			prisma.$executeRaw`
				DELETE FROM password_reset_token
				WHERE user_id = ${resetToken.user_id}
				AND id <> ${resetToken.id}
			`,
		]);

		return NextResponse.json({
			message: "Votre mot de passe a bien été réinitialisé.",
		});
	} catch (error) {
		console.error("Erreur reset-password:", error);

		return NextResponse.json(
			{ error: "Impossible de réinitialiser le mot de passe pour le moment." },
			{ status: 500 },
		);
	}
};
