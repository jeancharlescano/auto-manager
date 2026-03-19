"use client";
import Card from "@/components/Card";
import { car } from "@/generated/prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
	const [cars, setCars] = useState<car[]>([]);

	useEffect(() => {
		const loadCars = async () => {
			const res = await fetch("/api/vehicles", { credentials: "include" });
			const data = await res.json();
			setCars(data);
		};

		loadCars();
	}, []);

	console.log("🚀 ~ Home ~ cars:", cars);

	return (
		<div className=" min-h-screen bg-background font-sans max-w-screen">
			<main className="p-8 grid xl:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-x-8 gap-y-8 h-auto">
				{cars.map((car) => {
					return (
						<Link href={`/car-details/${car.license_plate}`} key={car.license_plate}>
							<Card carData={car} />
						</Link>
					);
				})}
				<Link
					href="/add-vehicule"
					className="h-72 border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer transition hover:scale-105 bg-secBackground border-gray-300"
				>
					<h4 className="text-xl">Nouveau Vehicule</h4>
					<p className="text-sm text-gray-300">
						Cliquer pour ajouter votre véhicule
					</p>
				</Link>
			</main>
		</div>
	);
}
