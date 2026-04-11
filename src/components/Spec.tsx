"use client"
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
		<div className="flex flex-col min-h-40 w-full pt-2 px-2 bg-secBackground rounded-lg shadow-2xl relative">
			<Icon
				icon="tabler:dots"
				className="self-end text-gray-400 cursor-pointer "
				width={16}
				height={16}
				onClick={() => {
					setEditMode(!editMode);
					if (!editMode) {
						setFormData(currentData);
					}
				}}
			/>
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="mdi:engine"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<div className="flex-1">
					{editMode ? (
						<input
							type="text"
							value={formData.engine}
							onChange={(e) => handleInputChange("engine", e.target.value)}
							className="w-full font-medium bg-transparent border-b border-gray-400"
						/>
					) : (
						<p className="font-medium">{currentData.engine}</p>
					)}
				</div>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="ix:road-filled"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<div className="flex-1">
					{editMode ? (
						<input
							type="number"
							value={formData.mileage}
							onChange={(e) => handleInputChange("mileage", Number(e.target.value))}
							className="w-full font-medium bg-transparent border-b border-gray-400"
						/>
					) : (
						<p className="font-medium">{currentData.mileage.toString()} Km</p>
					)}
				</div>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="mdi:gas-pump"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<div className="flex-1">
					{editMode ? (
						<input
							type="text"
							value={formData.fuelType}
							onChange={(e) => handleInputChange("fuelType", e.target.value)}
							className="w-full font-medium bg-transparent border-b border-gray-400"
						/>
					) : (
						<p className="font-medium">{currentData.fuelType}</p>
					)}
				</div>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="material-symbols:speed-outline-rounded"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<div className="flex-1">
					{editMode ? (
						<input
							type="number"
							value={formData.fiscalPower}
							onChange={(e) => handleInputChange("fiscalPower", Number(e.target.value))}
							className="w-full font-medium bg-transparent border-b border-gray-400"
						/>
					) : (
						<p className="font-medium">{currentData.fiscalPower.toString()} ch</p>
					)}
				</div>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon icon="ph:tire" className="text-gray-400" width={32} height={32} />
				<div className="flex-1">
					{editMode ? (
						<input
							type="text"
							value={formData.tireSize}
							onChange={(e) => handleInputChange("tireSize", e.target.value)}
							className="w-full font-medium bg-transparent border-b border-gray-400"
						/>
					) : (
						<p className="font-medium">{currentData.tireSize}</p>
					)}
				</div>
			</div>
			<div className="flex items-center space-x-4 mb-4">
				<Icon
					icon="mdi:paint-outline"
					className="text-gray-400"
					width={32}
					height={32}
				/>
				<div className="flex-1">
					{editMode ? (
						<input
							type="text"
							value={formData.design}
							onChange={(e) => handleInputChange("design", e.target.value)}
							className="w-full font-medium bg-transparent border-b border-gray-400"
						/>
					) : (
						<p className="font-medium">{currentData.design}</p>
					)}
				</div>
			</div>
			{editMode && (
				<div className="flex justify-center">
					<Icon
						icon="mdi:check"
						className="text-green-500 cursor-pointer"
						width={32}
						height={32}
						onClick={handleSave}
					/>
				</div>
			)}
			{isLoading && (
				<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<Icon
						icon="mdi:loading"
						className="text-white animate-spin"
						width={48}
						height={48}
					/>
				</div>
			)}
		</div>
	);
}
