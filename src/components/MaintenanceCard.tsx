import { Icon } from "@iconify/react";

export default function MaintenanceCard() {
	return (
		<div className="h-auto rounded-lg shadow-xl p-2 mb-20">
			<div className="flex items-center justify-between mb-2">
				<h2 className="font-bold text-xl">Revision</h2>
				<div className="flex items-center">
					<Icon
						icon="mdi:calendar"
						width={24}
						height={24}
						className="text-gray-400"
					/>
					<p>12/02/2025</p>
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
					<p className="font text-md">120 000 km</p>
				</div>
				<p>15 000 €</p>
			</div>
			<ul className="px-8 overflow-auto max-h-40 mb-2">
				<li>Toto</li>
				<li>Toto</li>
				<li>Toto</li>
				<li>Toto</li>
				<li>Toto</li>
				<li>Toto</li>
				<li>Toto</li>
				<li>Toto</li>
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
