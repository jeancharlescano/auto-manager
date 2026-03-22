"use client";
import { Icon } from "@iconify/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useRef, useState } from "react";

export default function Login() {
	const router = useRouter();
	const [displayPwd, setdisplayPwd] = useState(false);
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		const res = await signIn("credentials", {
			email: email.current?.value,
			password: password.current?.value,
			redirect: false,
		});

		console.log(res);

		if (res?.ok) {
			router.push("/");
		} else {
			alert("Login failed");
		}
	};
	return (
		<div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
			<div className="w-1/6 bg-secBackground rounded p-4 shadow-2xl flex flex-col items-center">
				<h2 className="text-2xl font-bold text-foreground mb-4">Connexion</h2>
				<form className="flex flex-col" onSubmit={handleSubmit}>
					<label>Email</label>
					<input
						ref={email}
						type="email"
						className="border rounded mb-4 px-2"
					/>
					<label>Mot de passe</label>
					<div className="flex justify-between items-center space-x-2 mb-8">
						<input
							type={displayPwd ? "text" : "password"}
							ref={password}
							className="border rounded  px-2 "
						/>
						{displayPwd ? (
							<Icon
								icon="iconoir:eye-closed"
								className="cursor-pointer"
								onClick={() => setdisplayPwd(!displayPwd)}
							/>
						) : (
							<Icon
								icon="iconoir:eye-solid"
								className="cursor-pointer"
								onClick={() => setdisplayPwd(!displayPwd)}
							/>
						)}
					</div>
					<button
						type="submit"
						className="bg-blue-950 rounded text-white py-1 font-bold cursor-pointer mb-4"
					>
						Se connecter
					</button>
				</form>
				<div className="bg-background h-px w-3/4 mb-4" />
				<Link href="/register" className="text-sm underline">
					pas de compte ? crée en un
				</Link>
			</div>
		</div>
	);
}
