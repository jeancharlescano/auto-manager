import { Icon } from "@iconify/react";

export default function Spec() {
	return (
		<div className="flex flex-col min-h-40 w-full pt-4 px-4 bg-secBackground rounded-lg shadow-2xl ">
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="mdi:engine"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<p className="font-medium">2.0 TDI</p>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="ix:road-filled"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<p className="font-medium">95 000</p>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="mdi:gas-pump"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<p className="font-medium">Diesel</p>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="material-symbols:speed-outline-rounded"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<p className="font-medium">190 ch</p>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon icon="ph:tire" className="text-gray-400" width={32} height={32} />
				<p className="font-medium">215/60R16</p>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="mdi:paint-outline"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<p className="font-medium">Design</p>
			</div>
		</div>
	);
}
