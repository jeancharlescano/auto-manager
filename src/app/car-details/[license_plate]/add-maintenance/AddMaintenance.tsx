"use client";
import { part } from "@/generated/prisma/client";
import { MaintenancePartForm } from "@/types/maintenance";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

type FileWithPreview = {
	file: File;
	preview: string;
};

export default function AddMaintenancee({
	licensePlate,
}: {
	licensePlate: string;
}) {
	const router = useRouter();
	const [partList, setPartList] = useState<part[]>([]);
	const [pieces, setPieces] = useState<MaintenancePartForm[]>([]);
	const title = useRef<HTMLInputElement>(null);
	const date = useRef<HTMLInputElement>(null);
	const nextDate = useRef<HTMLInputElement>(null);
	const mileage = useRef<HTMLInputElement>(null);
	const totalPrice = useRef<HTMLInputElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [files, setFiles] = useState<FileWithPreview[]>([]);

	const addPiece = () => {
		setPieces([...pieces, { name: "", quantity: 1, price: 0 }]);
	};

	const updatePiece = <K extends keyof MaintenancePartForm>(
		index: number,
		field: K,
		value: MaintenancePartForm[K],
	) => {
		const updated = [...pieces];
		updated[index][field] = value;
		setPieces(updated);
	};

	const removePiece = (index: number) => {
		setPieces(pieces.filter((_, i) => i !== index));
	};

	const handleFiles = (selectedFiles: FileList) => {
		const newFiles: FileWithPreview[] = Array.from(selectedFiles).map((file) => ({
			file,
			preview: URL.createObjectURL(file),
		}));
		setFiles((prev) => [...prev, ...newFiles]);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			handleFiles(e.dataTransfer.files);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			handleFiles(e.target.files);
		}
	};

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("title", title.current?.value || "");
		formData.append("date", date.current?.value || "");
		formData.append("nextDate", nextDate.current?.value || "");
		formData.append("mileage", mileage.current?.value || "");
		formData.append("totalPrice", totalPrice.current?.value || "");
		formData.append("parts", JSON.stringify(pieces));
		files.forEach(({ file }) => {
			if (file.type.split("/")[0] === "image") {
				formData.append("image", file);
			} else {
				formData.append("file", file);
			}
		});

		const res = await fetch(`/api/vehicles/${licensePlate}/maintenance`, {
			method: "POST",
			body: formData,
		});

		if (res.ok) {
			router.push(`/car-details/${licensePlate}`);
		}
	};

	useEffect(() => {
		const getPartsList = async () => {
			const result = await fetch("/api/parts");
			const data = await result.json();
			setPartList(data);
		};
		getPartsList();
	}, []);

	return (
		<div className="w-full min-h-[calc(100vh-64px)] px-4 sm:px-8 md:px-12 py-6 flex items-start lg:items-center justify-center">
			<div className="w-full max-w-5xl bg-secBackground rounded p-4 sm:p-6 shadow-2xl flex flex-col">

				<div className="flex items-center justify-between w-full mb-6 sm:mb-8 gap-2">
					<div className="h-px bg-background flex-1" />
					<h2 className="text-lg sm:text-2xl font-bold text-foreground text-center whitespace-nowrap px-2">
						Ajouter une Maintenance
					</h2>
					<div className="h-px bg-background flex-1" />
				</div>

				<form
					onSubmit={handleSubmit}
					className="flex flex-1 flex-col text-foreground font-medium"
				>
					<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 mb-4">
						<label className="sm:w-1/4 font-semibold text-sm sm:text-base">
							Titre de la Maintenance :
						</label>
						<input
							className="sm:w-3/4 border px-2 py-1 rounded"
							placeholder="Ex: Révision"
							ref={title}
							type="text"
						/>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0 mb-4">
						<label className="sm:w-1/4 font-semibold text-sm sm:text-base pt-1">
							Date :
						</label>
						<div className="sm:w-3/4 flex flex-col xs:flex-row flex-wrap gap-2">
							<div className="flex items-center border rounded px-2 gap-2 flex-1 min-w-0">
								<Icon icon="mdi:calendar" className="text-xl shrink-0" />
								<input
									type="date"
									ref={date}
									className="w-full outline-none text-sm"
								/>
							</div>
							<div className="flex items-center border rounded px-2 gap-2 flex-1 min-w-0">
								<Icon icon="material-symbols:speed-outline-rounded" className="text-xl shrink-0" />
								<input
									type="number"
									ref={mileage}
									placeholder="Kilométrage"
									className="w-full outline-none text-sm"
								/>
							</div>
							<div className="flex items-center border rounded px-2 gap-2 flex-1 min-w-0">
								<Icon icon="material-symbols:euro" className="text-xl shrink-0" />
								<input
									type="number"
									ref={totalPrice}
									placeholder="Coût total"
									className="w-full outline-none text-sm"
								/>
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 mb-4">
						<label className="sm:w-1/4 font-semibold text-sm sm:text-base">
							Date prochaine maintenance :
						</label>
						<div className="sm:w-3/4 flex">
							<div className="flex items-center border rounded px-2 gap-2 flex-1 sm:max-w-xs">
								<Icon icon="mdi:calendar" className="text-xl shrink-0" />
								<input
									type="date"
									ref={nextDate}
									className="w-full outline-none text-sm"
								/>
							</div>
						</div>
					</div>

					<div className="flex flex-col lg:flex-row gap-4 lg:gap-0">

						<div className="shadow-2xl rounded px-4 py-2 flex flex-col lg:flex-4">
							<div className="flex items-center mb-2">
								<h3 className="text-base sm:text-xl font-semibold text-foreground whitespace-nowrap pr-3">
									Pièces Changées
								</h3>
								<div className="h-px bg-background flex-1" />
							</div>

							<div className="overflow-y-auto max-h-48 sm:max-h-60 lg:h-72 space-y-1">
								{pieces.map((piece, index) => (
									<div
										key={index}
										className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 bg-background rounded-lg px-3 py-1"
									>
										<input
											type="text"
											list="partsList"
											placeholder="Nom de la pièce"
											value={piece.name}
											onChange={(e) => updatePiece(index, "name", e.target.value)}
											className="flex-1 min-w-0 outline-none border border-secBackground rounded px-2 text-sm"
										/>
										<datalist id="partsList">
											{partList.map((part) => (
												<option key={part.id} value={part.name} />
											))}
										</datalist>

										<div className="flex items-center gap-1">
											<input
												type="number"
												min="1"
												value={piece.quantity}
												onChange={(e) => updatePiece(index, "quantity", Number(e.target.value))}
												className="w-14 border border-secBackground rounded px-2 text-sm"
											/>
											<span className="text-sm">Qte</span>
										</div>

										<div className="flex items-center gap-1">
											<input
												type="number"
												min="1"
												value={piece.price}
												onChange={(e) => updatePiece(index, "price", Number(e.target.value))}
												className="w-14 border border-secBackground rounded px-2 text-sm"
											/>
											<span className="text-sm">€</span>
										</div>

										<button
											onClick={() => removePiece(index)}
											className="text-red-500 cursor-pointer transition hover:scale-105 shrink-0"
										>
											<Icon icon="mdi:trash-can-outline" width="20" />
										</button>
									</div>
								))}
							</div>

							<button
								type="button"
								onClick={addPiece}
								className="flex items-center gap-2 mt-4 bg-blue-950 text-white px-2 py-1 rounded-lg w-full sm:w-48 text-sm justify-center sm:justify-start"
							>
								<Icon icon="mdi:plus" />
								Ajouter une pièce
							</button>
						</div>

						<div className="lg:pl-4 flex lg:flex-2">
							<div
								onDragOver={(e) => e.preventDefault()}
								onDrop={handleDrop}
								onClick={() => inputRef.current?.click()}
								className="border rounded border-dashed w-full border-foreground hover:bg-background flex flex-col items-center justify-center cursor-pointer p-4 min-h-40 lg:min-h-0"
							>
								{files.length > 0 ? (
									<div className="flex flex-col gap-2 w-full">
										{files.map((f, idx) => (
											<div
												key={idx}
												className="flex items-center gap-2 border p-2 rounded w-full"
											>
												<Icon
													icon={
														f.file.type.startsWith("image/")
															? "mdi:image"
															: "mdi:file-document"
													}
													width={24}
													height={24}
												/>
												<span className="text-sm truncate">{f.file.name}</span>
											</div>
										))}
									</div>
								) : (
									<div className="flex flex-col items-center">
										<Icon icon="mdi:file-outline" width={48} height={48} />
										<h3 className="text-base sm:text-xl font-bold text-center">
											Glissez vos documents
										</h3>
										<span className="text-sm">ou</span>
										<h3 className="text-base sm:text-xl font-bold">Cliquez</h3>
									</div>
								)}

								<input
									ref={inputRef}
									type="file"
									accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
									multiple
									onChange={handleChange}
									className="hidden"
								/>
							</div>
						</div>
					</div>

					<button
						type="submit"
						className="mt-6 sm:mt-8 w-full sm:w-1/2 py-2 self-center rounded text-white bg-blue-950 font-bold cursor-pointer text-sm sm:text-base"
					>
						Valider
					</button>
				</form>
			</div>
		</div>
	);
}