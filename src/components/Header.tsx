"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect } from "react";

export default function Header() {
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
			<Link href="/" className="text-2xl font-bold">Auto-Track</Link>
			<div className="flex space-x-2 items-center">
				<Icon icon="ix:light-dark" width={24} height={24} onClick={toggleChangeTheme} className="cursor-pointer"/>
				<Link href="/user">
					<Icon
						icon="solar:user-circle-outline"
						width={48}
						height={48}
						className="p-1 cursor-pointer hover:scale-105 transition-all "
					/>
				</Link>
			</div>
		</header>
	);
}
