"use client";
import { signOut, useSession } from "next-auth/react";

export default function User() {
	const { data: session, status } = useSession();

	return (
		<div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
			<div className="w-full max-w-md bg-secBackground rounded-3xl p-8 shadow-lg">
				{status === "authenticated" && session ? (
					<>
						<div className="mb-6">
							<p className="text-sm text-gray-500">Utilisateur connecté</p>
							<h1 className="mt-2 text-2xl font-semibold text-foreground">
								{session.user.name || session.user.email}
							</h1>
							{session.user.email && (
								<p className="mt-2 text-sm text-gray-500">{session.user.email}</p>
							)}
						</div>
						<button
							className="w-full rounded-2xl bg-blue-950 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
							onClick={() => signOut()}
						>
							Se déconnecter
						</button>
					</>
				) : (
					<div className="text-center">
						<p className="text-sm text-gray-500">Vous n’êtes pas connecté.</p>
						<a
							href="/api/auth/signin"
							className="inline-flex mt-6 rounded-2xl bg-blue-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
						>
							Se connecter
						</a>
					</div>
				)}
			</div>
		</div>
	);
}
