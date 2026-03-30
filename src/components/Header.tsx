"use client";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

export default function Header() {
	const { data: session } = useSession();

	useEffect(() => {
		const root = document.documentElement;
		if (!root.getAttribute("data-theme")) {
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				root.setAttribute("data-theme", "dark");
			} else {
				root.setAttribute("data-theme", "light");
			}
		}
	}, []);

	const toggleChangeTheme = () => {
		const root = document.documentElement;
		if (root.getAttribute("data-theme") === "dark") {
			root.setAttribute("data-theme", "light");
		} else {
			root.setAttribute("data-theme", "dark");
		}
	};

	return (
		<header className="h-16 flex items-center justify-between bg-blue-950 px-4 text-white">
			<Link href="/" className="text-2xl font-bold">
				Auto-Track
			</Link>
			<div className="flex space-x-2 items-center">
				<Icon
					icon="ix:light-dark"
					width={24}
					height={24}
					onClick={toggleChangeTheme}
					className="cursor-pointer"
				/>
				{session ? (
					<Link href="/user">
						<div
							className="w-12 h-12 cursor-pointer hover:scale-105 transition-all bg-secBackground rounded-full flex items-center justify-center select-none"
						>
							<span className="text-foreground text-xl">
								{session.user.firstname?.charAt(0).toUpperCase()}
							</span>
						</div>
					</Link>
				) : (
					<Link href="/login">
						<Icon
							icon="mdi:user"
							width={48}
							height={48}
							className="p-1 cursor-pointer hover:scale-105 transition-all "
						/>
					</Link>
				)}
			</div>
		</header>
	);
}
