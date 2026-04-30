"use client";

import carImg from "@/assets/car.png";
import type { CarWithNextMaintenance } from "@/types/car";

export default function Card({ carData }: { carData: CarWithNextMaintenance }) {
	const nextMaintenance = carData.maintenances[0];
	const nextMaintenanceDate = nextMaintenance?.next_maintenance_date
		? new Date(nextMaintenance.next_maintenance_date)
		: null;
	const nextMaintenanceLabel = nextMaintenanceDate
		? `Prochaine maintenance: ${nextMaintenanceDate.toLocaleDateString("fr-FR")}`
		: "Aucune maintenance planifiée";

	return (
		<div className="h-72 rounded w-full shadow-xl bg-secBackground overflow-hidden cursor-pointer transition hover:scale-[102%]">
			<div className="h-2/3 overflow-hidden relative">
				<img
					src={
						carData.picture_url
							? `${process.env.NEXT_PUBLIC_CDN_API_URL}${carData.picture_url}`
							: carImg.src
					}
					onError={(event) => {
						if (event.currentTarget.src !== carImg.src) {
							event.currentTarget.src = carImg.src;
						}
					}}
					alt={`${carData.brand} ${carData.model}`}
					className="w-full h-full object-cover object-center"
				/>
			</div>
			<div className="h-1/3 p-2 flex flex-col justify-between">
				<div>
					<h3 className="text-foreground font-medium">
						{carData.brand} - {carData.model}
					</h3>
					<p className="text-foreground/60 font-bold">
						{carData.year} - {carData.engine}
					</p>
				</div>
				<p
					className="text-foreground/60 text-xs truncate"
					title={nextMaintenanceLabel}
				>
					{nextMaintenanceLabel}
				</p>
			</div>
		</div>
	);
}
