import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import type { Session, User } from "next-auth";
export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				const user = await prisma.user.findUnique({
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
					firstname: user.firstname,
					lastname: user.lastname,
				};
			},
		}),
	],

	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt" as const,
	},

	callbacks: {
		async jwt({ token, user }: { token: any; user: User }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.firstname = user.firstname;
				token.lastname = user.lastname;
			}
			return token;
		},
		async session({ session, token }: { session: Session; token: any }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.email = token.email;
				session.user.firstname = token.firstname;
				session.user.lastname = token.lastname;
			}
			return session;
		},
	},
};
