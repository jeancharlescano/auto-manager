import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			email?: string | null;
			firstname?: string | null;
			lastname?: string | null;
		} & DefaultSession["user"];
	}

	interface User {
		id: string;
		email?: string | null;
		firstname?: string | null;
		lastname?: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
		email?: string;
		firstname?: string;
		lastname?: string;
	}
}
