"use client";
import Card from "@/components/Card";
import { car } from "@/generated/prisma/client";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
	const router = useRouter();
	const { status } = useSession();
	const [cars, setCars] = useState<car[]>([]);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [selectedCars, setSelectedCars] = useState<string[]>([]);

	const handleEditCarData = () => {
		if (selectedCars.length > 1) {
			alert("Veuillez sélectionner un seul véhicule pour l'éditer.");
			return;
		}

		router.push(`/add-vehicule?edit=true&license_plate=${selectedCars[0]}`);
	};

	const handleDeleteCar = async () => {
		if (selectedCars.length === 0) {
			return;
		}
		if (
			!confirm(
				"Etes-vous sûr de vouloir supprimer les véhicules sélectionnés ?",
			)
		) {
			return;
		}

		try {
			const res = await fetch("/api/vehicles", {
				method: "DELETE",
				body: JSON.stringify({ licensePlates: selectedCars }),
			});

			if (res.ok) {
				setCars(
					cars.filter((car) => !selectedCars.includes(car.license_plate)),
				);
			}
		} catch (error) {
			console.error("🚀 ~ handleDeleteCar ~ error:", error);
		}
	};

	useEffect(() => {
		if (status !== "authenticated") return;

		const loadCars = async () => {
			const res = await fetch("/api/vehicles", { credentials: "include" });
			const data = await res.json();
			setCars(data);
		};

		loadCars();
	}, [status]);

	if (status === "loading") {
		return (
			<div className="mt-50 items-center justify-items-center ">
				<Icon icon="mdi:loading" width={64} className="animate-spin" />
			</div>
		);
	}

	return (
		<div className=" min-h-screen bg-background font-sans max-w-screen">
			<div className="flex justify-end items-center h-16 px-2">
				{editMode ? (
					<div className="flex space-x-1">
						<Icon
							icon="mdi:edit-outline"
							width={28}
							className="text-blue-500 hover:scale-95 transition-all cursor-pointer"
							onClick={handleEditCarData}
						/>
						<Icon
							icon="mdi:trash-outline"
							width={28}
							className="text-red-500 hover:scale-95 transition-all cursor-pointer"
							onClick={handleDeleteCar}
						/>
						<Icon
							icon="mdi:close"
							width={28}
							className="text-foreground hover:scale-95 transition-all cursor-pointer "
							onClick={() => setEditMode(!editMode)}
						/>
					</div>
				) : (
					<Icon
						icon="tabler:dots"
						width={28}
						className="text-foreground hover:scale-95 transition-all cursor-pointer"
						onClick={() => setEditMode(!editMode)}
					/>
				)}
			</div>

			<main className="px-8 grid xl:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-x-8 gap-y-8 h-auto select-none">
				{cars.map((car) => {
					return (
						<div
							key={car.license_plate}
							className={`relative ${selectedCars.includes(car.license_plate) ? "border-2 border-blue-500 rounded" : ""}`}
						>
							<Link
								href={`/car-details/${car.license_plate}`}
								className={editMode ? "pointer-events-none" : ""}
							>
								<Card carData={car} />
							</Link>
							{editMode && (
								<div
									onClick={() => {
										if (selectedCars.includes(car.license_plate)) {
											setSelectedCars(
												selectedCars.filter((id) => id !== car.license_plate),
											);
										} else {
											setSelectedCars([...selectedCars, car.license_plate]);
										}
									}}
									className="absolute inset-0 z-10 cursor-pointer rounded hover:bg-gray-200/50 p-4"
								>
									<div className="w-5 h-5 border absolute top-2 left-2 rounded"></div>
									{selectedCars.includes(car.license_plate) && (
										<Icon
											icon="mdi:check"
											width={20}
											className="absolute top-2 left-2 text-green-500"
										/>
									)}
								</div>
							)}
						</div>
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
