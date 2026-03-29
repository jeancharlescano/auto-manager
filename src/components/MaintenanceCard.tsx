import { Icon } from "@iconify/react";
import { MaintenanceData } from "../types/maintenance";

export default function MaintenanceCard({
	maintenanceData,
	onDelete,
}: {
	maintenanceData: MaintenanceData;
	onDelete: (id: number) => Promise<void>;
}) {
	const handleDownloadInvoices = async () => {
		const res = await fetch("/api/media/download", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				maintenanceId: maintenanceData.id,
				carId: maintenanceData.car_id,
			}),
		});

		if (!res.ok) {
			const error = await res.json();
			alert(error.message);
			return;
		}

		const blob = await res.blob();
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "invoices.zip";
		a.click();
	};

	return (
		<div className="h-auto rounded-lg shadow-xl p-2 mb-10 bg-secBackground">
			<div className="w-full flex justify-end items-center mb-0.5">
				<Icon
					icon="bitcoin-icons:cross-filled"
					height={18}
					className="hover:scale-105 cursor-pointer"
					onClick={() => onDelete(maintenanceData.id)}
				></Icon>
			</div>
			<div className="flex items-end justify-between mb-2">
				<h2 className="font-bold text-xl">{maintenanceData.title}</h2>
				<div className="flex items-center space-x-0.5">
					<Icon
						icon="mdi:calendar"
						width={24}
						height={24}
						className="text-gray-400"
					/>
					<p>
						{new Date(maintenanceData.maintenance_date).toLocaleDateString()}
					</p>
				</div>
			</div>
			<div className="flex items-end justify-between mb-2">
				<div className="flex items-center space-x-0.5">
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
				<div
					className="flex flex-col items-center cursor-pointer rounded p-0.5 shadow-sm shadow-black px-1 hover:scale-98 transition-all"
					onClick={handleDownloadInvoices}
				>
					<Icon
						icon="bx:file"
						width={36}
						height={36}
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
