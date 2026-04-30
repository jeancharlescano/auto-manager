import crypto from "crypto";

export const PASSWORD_RESET_TOKEN_TTL_MINUTES = 60;

export function createPasswordResetToken() {
	return crypto.randomBytes(32).toString("hex");
}

export function hashPasswordResetToken(token: string) {
	return crypto.createHash("sha256").update(token).digest("hex");
}

export function getPasswordResetExpirationDate() {
	return new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000);
}

