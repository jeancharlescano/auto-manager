"use client";
import { Icon } from "@iconify/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
	const [displayPwd, setdisplayPwd] = useState(false);
	const router = useRouter();
	const firstname = useRef<HTMLInputElement>(null);
	const lastname = useRef<HTMLInputElement>(null);
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!email.current?.value || !password.current?.value) {
			alert("Missing fields");
			return;
		}
		
		const result = await fetch("/api/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				firstname: firstname.current?.value,
				lastname: lastname.current?.value,
				email: email.current?.value,
				password: password.current?.value,
			}),
		});
		const data = await result.json();
		console.log(data);

		if (result?.ok) {
			const login = await signIn("credentials", {
				email: email.current?.value,
				password: password.current?.value,
				redirect: false,
			});
			if (login?.ok) {
				router.push("/");
			}
		} else {
			alert("Login failed");
		}
	};
	return (
		<div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
			<div className="w-1/6 bg-secBackground rounded p-4 shadow-2xl flex flex-col items-center">
				<h2 className="text-2xl font-bold text-foreground mb-4">Inscription</h2>
				<form className="flex flex-col" onSubmit={handleSubmit}>
					<label>Prénom</label>
					<input
						ref={firstname}
						type="text"
						className="border rounded mb-4 px-2"
					/>
					<label>Nom</label>
					<input
						ref={lastname}
						type="text"
						className="border rounded mb-4 px-2"
					/>
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
						S'inscrire
					</button>
				</form>
				<div className="bg-background h-px w-3/4 mb-4" />
				<Link href="/login" className="text-sm underline">
					Déjà un compte ? Connecte-toi
				</Link>
			</div>
		</div>
	);
}
