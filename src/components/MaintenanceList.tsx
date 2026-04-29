"use client";

import { useState } from "react";
import MaintenanceCard from "./MaintenanceCard";
import { MaintenanceData } from "@/types/maintenance";

export default function MaintenanceList({
	maintenances,
}: {
	maintenances: MaintenanceData[];
}) {
	const [maintenanceData, setMaintenanceData] = useState(maintenances);

	const handleDelete = async (id: number) => {
		const maintenance = maintenanceData.find((m) => m.id === id);

		if (!maintenance) return;

		if (!confirm("Etes-vous sûr de vouloir supprimer cette maintenance ?"))
			return;

		const res = await fetch(
			`/api/vehicles/${maintenance.car_id}/maintenance/${maintenance.id}`,
			{ method: "DELETE" },
		);
		if (res.ok) {
			setMaintenanceData((prev) => prev.filter((m) => m.id !== id));
		}
	};

	return (
		<>
			{maintenanceData.map((maintenance) => (
				<MaintenanceCard
					key={maintenance.id}
					maintenanceData={maintenance}
					onDelete={handleDelete}
				/>
			))}
		</>
	);
}
