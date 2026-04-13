"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

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
	carId,
}: carSpec) {
	const [editMode, setEditMode] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [currentData, setCurrentData] = useState({
		brand: brand as string,
		model: model as string,
		year: year as number,
		engine: engine as string,
		mileage: mileage as number,
		fuelType: fuelType as string,
		fiscalPower: fiscalPower as number,
		tireSize: tireSize as string,
		design: design as string,
	});
	const [formData, setFormData] = useState(currentData);

	const handleInputChange = (field: string, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = async () => {
		const changedData: Record<string, string | number> = {};
		if (formData.engine !== currentData.engine) changedData.engine = formData.engine;
		if (formData.mileage !== currentData.mileage) changedData.mileage = formData.mileage;
		if (formData.fuelType !== currentData.fuelType) changedData.fuelType = formData.fuelType;
		if (formData.fiscalPower !== currentData.fiscalPower) changedData.fiscalPower = formData.fiscalPower;
		if (formData.tireSize !== currentData.tireSize) changedData.tireSize = formData.tireSize;
		if (formData.design !== currentData.design) changedData.design = formData.design;

		if (Object.keys(changedData).length === 0) {
			setEditMode(false);
			return;
		}

		setIsLoading(true);
		const form = new FormData();
		Object.entries(changedData).forEach(([key, value]) => {
			form.append(key, value.toString());
		});

		try {
			const res = await fetch(`/api/vehicles/${carId}`, {
				method: "PATCH",
				body: form,
			});
			if (res.ok) {
				setCurrentData((prev) => ({ ...prev, ...changedData }));
				setFormData((prev) => ({ ...prev, ...changedData }));
				setEditMode(false);
			} else {
				console.error("Failed to update");
			}
		} catch (error) {
			console.error("Error updating:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-secBackground rounded-2xl overflow-hidden shadow-sm relative">
			{/* Header */}
			<div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-black/10 dark:border-white/10">
				<div>
					<h2 className="font-medium text-[15px] mb-1">
						{currentData.brand} {currentData.model}
					</h2>
					<span className="text-xs text-gray-400">{currentData.year}</span>
				</div>
				<button
					onClick={() => {
						setEditMode(!editMode);
						if (!editMode) setFormData(currentData);
					}}
					className="w-6 h-6 rounded-full bg-background flex items-center justify-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
				>
					<Icon icon="tabler:dots" width={14} height={14} />
				</button>
			</div>

			{/* Specs */}
			<div className="bg-background rounded-xl overflow-hidden m-3">
				{/* Moteur */}
				<div className="flex items-center justify-between px-3 py-2.5 border-b border-black/10 dark:border-white/10">
					<div className="flex items-center gap-2 text-gray-400">
						<Icon icon="mdi:engine" width={15} height={15} />
						<span className="text-xs">Moteur</span>
					</div>
					{editMode ? (
						<input
							type="text"
							value={formData.engine}
							onChange={(e) => handleInputChange("engine", e.target.value)}
							className="text-[13px] font-medium text-right bg-transparent border-b border-gray-400 outline-none w-28"
						/>
					) : (
						<span className="text-[13px] font-medium">{currentData.engine}</span>
					)}
				</div>

				{/* Kilométrage */}
				<div className="flex items-center justify-between px-3 py-2.5 border-b border-black/10 dark:border-white/10">
					<div className="flex items-center gap-2 text-gray-400">
						<Icon icon="ix:road-filled" width={15} height={15} />
						<span className="text-xs">Kilométrage</span>
					</div>
					{editMode ? (
						<input
							type="number"
							value={formData.mileage}
							onChange={(e) => handleInputChange("mileage", Number(e.target.value))}
							className="text-[13px] font-medium text-right bg-transparent border-b border-gray-400 outline-none w-28"
						/>
					) : (
						<span className="text-[13px] font-medium">{currentData.mileage} km</span>
					)}
				</div>

				{/* Carburant */}
				<div className="flex items-center justify-between px-3 py-2.5 border-b border-black/10 dark:border-white/10">
					<div className="flex items-center gap-2 text-gray-400">
						<Icon icon="mdi:gas-pump" width={15} height={15} />
						<span className="text-xs">Carburant</span>
					</div>
					{editMode ? (
						<input
							type="text"
							value={formData.fuelType}
							onChange={(e) => handleInputChange("fuelType", e.target.value)}
							className="text-[13px] font-medium text-right bg-transparent border-b border-gray-400 outline-none w-28"
						/>
					) : (
						<span className="text-[13px] font-medium">{currentData.fuelType}</span>
					)}
				</div>

				{/* Puissance */}
				<div className="flex items-center justify-between px-3 py-2.5 border-b border-black/10 dark:border-white/10">
					<div className="flex items-center gap-2 text-gray-400">
						<Icon icon="material-symbols:speed-outline-rounded" width={15} height={15} />
						<span className="text-xs">Puissance</span>
					</div>
					{editMode ? (
						<input
							type="number"
							value={formData.fiscalPower}
							onChange={(e) => handleInputChange("fiscalPower", Number(e.target.value))}
							className="text-[13px] font-medium text-right bg-transparent border-b border-gray-400 outline-none w-28"
						/>
					) : (
						<span className="text-[13px] font-medium">{currentData.fiscalPower} ch</span>
					)}
				</div>

				{/* Pneus */}
				<div className="flex items-center justify-between px-3 py-2.5 border-b border-black/10 dark:border-white/10">
					<div className="flex items-center gap-2 text-gray-400">
						<Icon icon="ph:tire" width={15} height={15} />
						<span className="text-xs">Pneus</span>
					</div>
					{editMode ? (
						<input
							type="text"
							value={formData.tireSize}
							onChange={(e) => handleInputChange("tireSize", e.target.value)}
							className="text-[13px] font-medium text-right bg-transparent border-b border-gray-400 outline-none w-28"
						/>
					) : (
						<span className="text-[13px] font-medium">{currentData.tireSize}</span>
					)}
				</div>

				{/* Carrosserie */}
				<div className="flex items-center justify-between px-3 py-2.5">
					<div className="flex items-center gap-2 text-gray-400">
						<Icon icon="mdi:paint-outline" width={15} height={15} />
						<span className="text-xs">Carrosserie</span>
					</div>
					{editMode ? (
						<input
							type="text"
							value={formData.design}
							onChange={(e) => handleInputChange("design", e.target.value)}
							className="text-[13px] font-medium text-right bg-transparent border-b border-gray-400 outline-none w-28"
						/>
					) : (
						<span className="text-[13px] font-medium">{currentData.design}</span>
					)}
				</div>
			</div>

			{/* Save button */}
			{editMode && (
				<div className="flex justify-end px-4 pb-4">
					<button
						onClick={handleSave}
						className="flex items-center gap-1.5 text-xs text-green-600 bg-background rounded-lg px-3 py-2 hover:opacity-80 transition cursor-pointer"
					>
						<Icon icon="mdi:check" width={14} height={14} />
						Enregistrer
					</button>
				</div>
			)}

			{/* Loading overlay */}
			{isLoading && (
				<div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
					<Icon
						icon="mdi:loading"
						className="text-white animate-spin"
						width={32}
						height={32}
					/>
				</div>
			)}
		</div>
	);
}