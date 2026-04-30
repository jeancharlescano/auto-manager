"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function ForgotPassword() {
	const router = useRouter();
	const { status } = useSession();
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [resetUrl, setResetUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/");
		}
	}, [status, router]);

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setMessage("");
		setError("");
		setResetUrl("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error ?? "Une erreur est survenue.");
				return;
			}

			setMessage(data.message);

			if (data.resetUrl) {
				setResetUrl(data.resetUrl);
			}
		} catch (err) {
			console.error(err);
			setError("Une erreur est survenue.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full min-h-[calc(100vh-64px)] px-4 sm:px-8 md:px-12 py-6 flex items-start lg:items-center justify-center">
			<div className="w-full max-w-md bg-secBackground rounded p-4 sm:p-6 shadow-lg flex flex-col">
				<div className="flex items-center justify-between w-full mb-4 gap-2">
					<div className="h-px bg-background flex-1" />
					<h2 className="text-lg sm:text-2xl font-bold text-foreground text-center whitespace-nowrap px-2">
						Mot de passe oublié
					</h2>
					<div className="h-px bg-background flex-1" />
				</div>

				<form
					className="flex flex-1 flex-col text-foreground font-medium space-y-4"
					onSubmit={handleSubmit}
				>
					<div className="bg-secBackground rounded-lg shadow-sm p-2">
						<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
							<label className="sm:w-1/4 font-semibold text-sm sm:text-base">
								Email :
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="sm:w-3/4 border-0 border-b-2 border-gray-300 focus:border-blue-500 transition-colors px-2 py-1 bg-transparent outline-none"
							/>
						</div>
					</div>

					{message && (
						<p className="text-sm text-green-600 text-center">{message}</p>
					)}

					{resetUrl && (
						<Link
							href={resetUrl}
							className="text-sm underline text-blue-700 self-center break-all text-center"
						>
							Ouvrir le lien de réinitialisation
						</Link>
					)}

					{error && <p className="text-sm text-red-600 text-center">{error}</p>}

					<button
						type="submit"
						disabled={isLoading}
						className="mt-4 w-full sm:w-1/2 py-2 self-center rounded-lg text-white bg-blue-950 hover:bg-blue-800 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors font-bold cursor-pointer text-sm sm:text-base shadow-md"
					>
						{isLoading ? "Envoi..." : "Envoyer le lien"}
					</button>
				</form>

				<div className="bg-background h-px w-3/4 mb-4 self-center mt-4" />
				<Link href="/login" className="text-sm underline self-center">
					Retour à la connexion
				</Link>
			</div>
		</div>
	);
}
