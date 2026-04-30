type SendPasswordResetEmailParams = {
	to: string;
	resetUrl: string;
};

export async function sendPasswordResetEmail({
	to,
	resetUrl,
}: SendPasswordResetEmailParams) {
	const apiKey = process.env.RESEND_API_KEY;
	const from =
		process.env.PASSWORD_RESET_EMAIL_FROM ??
		process.env.EMAIL_FROM ??
		"Auto Manager <onboarding@resend.dev>";

	if (!apiKey) {
		console.info(`[password-reset] Lien de réinitialisation pour ${to}: ${resetUrl}`);
		return { sent: false };
	}

	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from,
			to,
			subject: "Réinitialisation de votre mot de passe Auto Manager",
			text: `Bonjour,\n\nVous avez demandé à réinitialiser votre mot de passe Auto Manager.\n\nCliquez sur ce lien pour choisir un nouveau mot de passe : ${resetUrl}\n\nCe lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.`,
			html: `
				<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #171717;">
					<h1 style="font-size: 20px;">Réinitialisation du mot de passe</h1>
					<p>Bonjour,</p>
					<p>Vous avez demandé à réinitialiser votre mot de passe Auto Manager.</p>
					<p>
						<a href="${resetUrl}" style="display: inline-block; padding: 10px 16px; background: #172554; color: #ffffff; text-decoration: none; border-radius: 8px;">
							Choisir un nouveau mot de passe
						</a>
					</p>
					<p>Ce lien expire dans 1 heure.</p>
					<p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
				</div>
			`,
		}),
	});

	if (!response.ok) {
		const message = await response.text();
		throw new Error(`Erreur Resend ${response.status}: ${message}`);
	}

	return { sent: true };
}

