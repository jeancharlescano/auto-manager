import { maintenance } from "@/generated/prisma/client";
import { Icon } from "@iconify/react";
import { MaintenanceData } from "../types/maintenance";

export default function MaintenanceCard({
	maintenanceData,
}: {
	maintenanceData: MaintenanceData;
}) {
	return (
		<div className="h-auto rounded-lg shadow-xl p-2 mb-10 bg-secBackground">
			<div className="flex items-center justify-between mb-2">
				<h2 className="font-bold text-xl">{maintenanceData.title}</h2>
				<div className="flex items-center">
					<Icon
						icon="mdi:calendar"
						width={24}
						height={24}
						className="text-gray-400"
					/>
					<p>{maintenanceData.maintenance_date.toLocaleDateString("fr-FR")}</p>
				</div>
			</div>
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center">
					<Icon
						icon="ix:road-filled"
						width={24}
						height={24}
						className="text-gray-400"
					/>
					<p className="font text-md">{maintenanceData.mileage_at_time} km</p>
				</div>
				<p>{Number(maintenanceData.total_cost)} €</p>
			</div>
			<ul className="px-8 overflow-auto max-h-40 mb-2 bg-background rounded">
				{maintenanceData.maintenance_parts.map((maintenancePart) => {
					return (
						<li key={maintenancePart.part_id}>
							<div className="flex w-full">
								<p className="w-1/3">{maintenancePart.parts.name}</p>
								<p className="w-1/3 text-center">
									{maintenancePart.quantity} pce
								</p>
								<p className="w-1/3 text-right">
									{Number(maintenancePart.unit_price)} €
								</p>
							</div>
						</li>
					);
				})}
			</ul>
			<div className="w-full flex justify-end px-2">
				<div className="flex flex-col items-center cursor-pointer rounded">
					<Icon
						icon="bx:file"
						width={40}
						height={40}
						className="text-gray-400"
					/>
					<p className="text-[11px]">
						Télécharger <br /> les factures
					</p>
				</div>
			</div>
		</div>
	);
}
