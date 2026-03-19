import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import type { Session, User } from "next-auth";
export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				const user = await prisma.users.findUnique({
					where: { email: credentials.email },
				});

				if (!user || !user.password) return null;

				const isValid = await bcrypt.compare(
					credentials.password,
					user.password,
				);

				if (!isValid) return null;

				return {
					id: user.id.toString(),
					email: user.email,
					name: user.name,
				};
			},
		}),
	],

	session: {
		strategy: "jwt" as const,
	},

	callbacks: {
		async jwt({ token, user }: { token: any; user?: User }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
			}
			return token;
		},
		async session({ session, token }: { session: Session; token: any }) {
			if (session.user) {
				session.user.id = token.id as string;
			}
			return session;
		},
	},
};
