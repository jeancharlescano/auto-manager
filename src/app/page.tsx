"use client";
import Card from "@/components/Card";
import { ContextMenu } from "@/components/ContextMenu";
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
	const [contextMenu, setContextMenu] = useState({
		visible: false,
		x: 0,
		y: 0,
		carId: null as string | null,
	});

	const openContextMenu = (
		e: React.MouseEvent<HTMLDivElement>,
		carId: string,
	) => {
		e.preventDefault();
		const { clientX, clientY } = e;
		setContextMenu({ visible: true, x: clientX, y: clientY, carId });
	};

	const closeContextMenu = () => {
		setContextMenu({ visible: false, x: 0, y: 0, carId: null });
	};

	const handleEditCarData = () => {
		if (selectedCars.length > 1) {
			alert("Veuillez sélectionner un seul véhicule pour l'éditer.");
			return;
		}
	};

	const deleteCars = async (licensePlates: string[]) => {
		if (licensePlates.length === 0) return;

		if (
			!confirm(
				licensePlates.length > 1
					? "Etes-vous sûr de vouloir supprimer les véhicules sélectionnés ?"
					: "Etes-vous sûr de vouloir supprimer ce véhicule ?",
			)
		)
			return;

		try {
			const res = await fetch("/api/vehicles", {
				method: "DELETE",
				body: JSON.stringify({ licensePlates }),
			});

			if (res.ok) {
				setCars((prevCars) =>
					prevCars.filter((car) => !licensePlates.includes(car.license_plate)),
				);
				setSelectedCars((prevSelected) =>
					prevSelected.filter((id) => !licensePlates.includes(id)),
				);
			}
		} catch (error) {
			console.error("Erreur lors de la suppression :", error);
		}
	};

	useEffect(() => {
		const handleClick = () => closeContextMenu();

		window.addEventListener("click", handleClick);

		return () => {
			window.removeEventListener("click", handleClick);
		};
	}, []);

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
					<div className="flex space-x-1 items-center">
						<Icon
							icon="mdi:trash-outline"
							width={28}
							className="text-red-500 hover:scale-95 transition-all cursor-pointer"
							onClick={() => deleteCars(selectedCars)}
						/>
						<Icon
							icon="mdi:close"
							width={24}
							className="text-foreground hover:scale-95 transition-all cursor-pointer "
							onClick={() =>{
								setSelectedCars([])
								setEditMode(!editMode)}}
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
							className={`relative ${selectedCars.includes(car.license_plate) && editMode ? "border-2 border-blue-500 rounded" : ""}`}
							onContextMenu={(e) => openContextMenu(e, car.license_plate)}
						>
							<Link
								href={`/car-details/${car.license_plate}`}
								className={editMode ? "pointer-events-none" : ""}
							>
								<Card carData={car} />
							</Link>
							{contextMenu.visible &&
								contextMenu.carId === car.license_plate && (
									<ContextMenu x={contextMenu.x} y={contextMenu.y}>
										<button
											onClick={() => {
												if (!contextMenu.carId) return;
												router.push(
													`/add-vehicule?edit=true&license_plate=${contextMenu.carId}`,
												);
											}}
											className="block w-full text-left p-2 hover:bg-gray-200"
										>
											✏️ Modifier
										</button>
										<button
											onClick={() => {
												if (!contextMenu.carId) return;
												deleteCars([contextMenu.carId]);
												closeContextMenu();
											}}
											className="block w-full text-left p-2 hover:bg-gray-200 text-red-500"
										>
											🗑 Supprimer
										</button>
									</ContextMenu>
								)}
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
