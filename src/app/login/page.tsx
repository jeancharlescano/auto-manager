"use client";
import { Icon } from "@iconify/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

export default function Login() {
	const router = useRouter();
	const { status } = useSession();
	const [displayPwd, setdisplayPwd] = useState(false);
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/");
		}
	}, [status, router]);

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!email.current?.value || !password.current?.value) {
			alert("Champs non renseignés");
			return;
		}


		const res = await signIn("credentials", {
			email: email.current?.value,
			password: password.current?.value,
			redirect: false,
		});


		if (res?.ok) {
			router.push("/");
		} else {
			alert("Email ou mot de passe incorrect.");
		}
	};

	return (
		<div className="w-full min-h-[calc(100vh-64px)] px-4 sm:px-8 md:px-12 py-6 flex items-start lg:items-center justify-center">
			<div className="w-full max-w-md bg-secBackground rounded p-4 sm:p-6 shadow-lg flex flex-col">
				<div className="flex items-center justify-between w-full mb-4 gap-2">
					<div className="h-px bg-background flex-1" />
					<h2 className="text-lg sm:text-2xl font-bold text-foreground text-center whitespace-nowrap px-2">
						Connexion
					</h2>
					<div className="h-px bg-background flex-1" />
				</div>

				<form
					className="flex flex-1 flex-col text-foreground font-medium space-y-4"
					onSubmit={handleSubmit}
				>
					{/* Email */}
					<div className="bg-secBackground rounded-lg shadow-sm p-2">
						<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
							<label className="sm:w-1/4 font-semibold text-sm sm:text-base">
								Email :
							</label>
							<input
								ref={email}
								type="email"
								required
								className="sm:w-3/4 border-0 border-b-2 border-gray-300 focus:border-blue-500 transition-colors px-2 py-1 bg-transparent outline-none"
							/>
						</div>
					</div>

					{/* Mot de passe */}
					<div className="bg-secBackground rounded-lg shadow-sm p-2">
						<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
							<label className="sm:w-2/5 font-semibold text-sm sm:text-base">
								Mot de passe :
							</label>
							<div className="sm:w-3/4 flex items-center px-2 gap-2">
								<input
									type={displayPwd ? "text" : "password"}
									ref={password}
									required
									className="w-full outline-none text-sm bg-transparent border-0 border-b-2 border-gray-300  focus:border-blue-500 transition-colors"
								/>
								{displayPwd ? (
									<Icon
										icon="iconoir:eye-closed"
										className="cursor-pointer shrink-0"
										onClick={() => setdisplayPwd(!displayPwd)}
									/>
								) : (
									<Icon
										icon="iconoir:eye-solid"
										className="cursor-pointer shrink-0"
										onClick={() => setdisplayPwd(!displayPwd)}
									/>
								)}
							</div>
						</div>
					</div>

					<button
						type="submit"
						className="mt-4 w-full sm:w-1/2 py-2 self-center rounded-lg text-white bg-blue-950 hover:bg-blue-800 transition-colors font-bold cursor-pointer text-sm sm:text-base shadow-md"
					>
						Se connecter
					</button>
				</form>

				<div className="bg-background h-px w-3/4 mb-4 self-center mt-4" />
				<Link href="/forgot-password" className="text-sm underline self-center mb-2">
					Mot de passe oublié ?
				</Link>
				<Link href="/register" className="text-sm underline self-center">
					Pas de compte ? Crée-en un
				</Link>
			</div>
		</div>
	);
}
