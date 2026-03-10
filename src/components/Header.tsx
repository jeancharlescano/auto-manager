import { User } from "lucide-react";

export default function Header() {
	return (
		<header className="h-16 flex items-center justify-between bg-blue-950 px-4 ">
			<h1 className="text-2xl font-bold ">
				Auto-Track
			</h1>
			<div className="rounded-full p-1 border-2 cursor-pointer hover:scale-105 transition-all">
				<User />
			</div>
		</header>
	)
}