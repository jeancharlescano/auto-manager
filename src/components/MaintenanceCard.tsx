"use client";
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
		<div className="bg-secBackground rounded-2xl overflow-hidden mb-4 shadow-sm">
			{/* Header */}
			<div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-black/10 dark:border-white/10">
				<div>
					<h2 className="font-medium text-[15px] mb-1">
						{maintenanceData.title}
					</h2>
					<div className="flex items-center gap-1 text-xs text-gray-400">
						<Icon icon="mdi:calendar-outline" width={13} height={13} />
						{new Date(maintenanceData.maintenance_date).toLocaleDateString(
							"fr-FR",
							{ day: "numeric", month: "long", year: "numeric" },
						)}
					</div>
				</div>
				<button
					onClick={() => onDelete(maintenanceData.id)}
					className="w-6 h-6 rounded-full bg-background flex items-center justify-center text-gray-400 hover:text-gray-600 transition text-xs cursor-pointer"
				>
					✕
				</button>
			</div>

			{/* Body */}
			<div className="px-4 pt-3 pb-2">
				{/* Badges */}
				<div className="flex flex-wrap gap-2 mb-3">
					<div className="flex items-center gap-1.5 bg-background rounded-lg px-3 py-1.5 text-xs text-gray-400">
						<Icon icon="ix:road-filled" width={13} height={13} />
						<span className="font-medium">
							{maintenanceData.mileage_at_time} km
						</span>
					</div>
					{maintenanceData.next_maintenance_date && (
						<div className="flex items-center gap-1.5 bg-background rounded-lg px-3 py-1.5 text-xs text-gray-400">
							<Icon icon="mdi:clock-outline" width={13} height={13} />
							<span>Prochaine révision</span>
							<span className="font-medium text-green-600">
								{new Date(
									maintenanceData.next_maintenance_date,
								).toLocaleDateString("fr-FR", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</span>
						</div>
					)}
				</div>

				{/* Liste des pièces */}
				{maintenanceData.maintenance_parts.length > 0 && (
					<div className="bg-background rounded-xl overflow-hidden mb-3">
						{maintenanceData.maintenance_parts.map((maintenancePart, i) => (
							<div
								key={maintenancePart.part_id}
								className={`flex items-center justify-between px-3 py-2 ${
									i < maintenanceData.maintenance_parts.length - 1
										? "border-b border-black/10 dark:border-white/10"
										: ""
								}`}
							>
								<span className="text-[13px] truncate flex-1 mr-2">
									{maintenancePart.parts.name}
								</span>
								<span className="text-gray-400 text-xs mr-3 shrink-0">
									{maintenancePart.quantity} pce
								</span>
								<span className="font-medium text-[13px] shrink-0">
									{Number(maintenancePart.unit_price)} €
								</span>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="flex items-center justify-between px-4 pb-4">
				<div>
					<p className="text-[11px] text-gray-400 mb-0.5">Total</p>
					<p className="font-medium text-[15px]">
						{Number(maintenanceData.total_cost)} €
					</p>
				</div>
				<button
					onClick={handleDownloadInvoices}
					className="flex items-center gap-1.5 text-xs text-gray-400 bg-background rounded-lg px-3 py-2 hover:opacity-80 transition cursor-pointer"
				>
					<Icon icon="bx:file" width={14} height={14} />
					Télécharger les factures
				</button>
			</div>
		</div>
	);
}