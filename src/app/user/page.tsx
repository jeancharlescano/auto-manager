"use client";
import { signOut, useSession } from "next-auth/react";

export default function User() {
	const { data: session, status } = useSession();

	if (status === "authenticated") {
		return (
			<>
				<p>Signed in as {session?.user.email}</p>;
				<button onClick={() => signOut()}>Logout</button>
			</>
		);
	}

	return <a href="/api/auth/signin">Sign in</a>;
}
