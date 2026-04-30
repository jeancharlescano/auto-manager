"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function ResetPasswordForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { status } = useSession();
	const token = searchParams.get("token") ?? "";
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [displayPwd, setDisplayPwd] = useState(false);
	const [displayConfirmPwd, setDisplayConfirmPwd] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isDone, setIsDone] = useState(false);

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/");
		}
	}, [status, router]);

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setMessage("");
		setError("");

		if (!token) {
			setError("Lien de réinitialisation invalide.");
			return;
		}

		if (password.length < 8) {
			setError("Le mot de passe doit contenir au moins 8 caractères.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Les mots de passe ne correspondent pas.");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error ?? "Une erreur est survenue.");
				return;
			}

			setMessage(data.message);
			setIsDone(true);
			setPassword("");
			setConfirmPassword("");
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
						Nouveau mot de passe
					</h2>
					<div className="h-px bg-background flex-1" />
				</div>

				{isDone ? (
					<div className="flex flex-col text-foreground font-medium space-y-4">
						{message && (
							<p className="text-sm text-green-600 text-center">{message}</p>
						)}
						<Link
							href="/login"
							className="mt-4 w-full sm:w-1/2 py-2 self-center rounded-lg text-white bg-blue-950 hover:bg-blue-800 transition-colors font-bold cursor-pointer text-sm sm:text-base shadow-md text-center"
						>
							Se connecter
						</Link>
					</div>
				) : (
					<form
						className="flex flex-1 flex-col text-foreground font-medium space-y-4"
						onSubmit={handleSubmit}
					>
						<div className="bg-secBackground rounded-lg shadow-sm p-2">
							<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
								<label className="sm:w-2/5 font-semibold text-sm sm:text-base">
									Mot de passe :
								</label>
								<div className="sm:w-3/5 flex items-center px-2 gap-2 bg-transparent">
									<input
										type={displayPwd ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className="w-full outline-none text-sm bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 transition-colors"
									/>
									<Icon
										icon={displayPwd ? "iconoir:eye-closed" : "iconoir:eye-solid"}
										className="cursor-pointer shrink-0"
										onClick={() => setDisplayPwd(!displayPwd)}
									/>
								</div>
							</div>
						</div>

						<div className="bg-secBackground rounded-lg shadow-sm p-2">
							<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
								<label className="sm:w-2/5 font-semibold text-sm sm:text-base">
									Confirmation :
								</label>
								<div className="sm:w-3/5 flex items-center px-2 gap-2 bg-transparent">
									<input
										type={displayConfirmPwd ? "text" : "password"}
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
										className="w-full outline-none text-sm bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 transition-colors"
									/>
									<Icon
										icon={
											displayConfirmPwd
												? "iconoir:eye-closed"
												: "iconoir:eye-solid"
										}
										className="cursor-pointer shrink-0"
										onClick={() => setDisplayConfirmPwd(!displayConfirmPwd)}
									/>
								</div>
							</div>
						</div>

						{error && <p className="text-sm text-red-600 text-center">{error}</p>}

						<button
							type="submit"
							disabled={isLoading || !token}
							className="mt-4 w-full sm:w-1/2 py-2 self-center rounded-lg text-white bg-blue-950 hover:bg-blue-800 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors font-bold cursor-pointer text-sm sm:text-base shadow-md"
						>
							{isLoading ? "Validation..." : "Modifier"}
						</button>
					</form>
				)}

				<div className="bg-background h-px w-3/4 mb-4 self-center mt-4" />
				<Link href="/login" className="text-sm underline self-center">
					Retour à la connexion
				</Link>
			</div>
		</div>
	);
}

