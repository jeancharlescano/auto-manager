import { Icon } from "@iconify/react";

export default function Spec({
	brand,
	model,
	year,
	engine,
	mileage,
	fuelType,
	fiscalPower,
	tireSize,
	design,
}: carSpec) {
	return (
		<div className="flex flex-col min-h-40 w-full pt-4 px-4 bg-secBackground rounded-lg shadow-2xl ">
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="mdi:engine"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<p className="font-medium">{engine}</p>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="ix:road-filled"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<p className="font-medium">{mileage.toString()}</p>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="mdi:gas-pump"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<p className="font-medium">{fuelType}</p>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="material-symbols:speed-outline-rounded"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<p className="font-medium">{fiscalPower.toString()} ch</p>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon icon="ph:tire" className="text-gray-400" width={32} height={32} />
				<p className="font-medium">{tireSize}</p>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="mdi:paint-outline"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<p className="font-medium">{design}</p>
			</div>
		</div>
	);
}
