"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function addMaintenance() {
	const [pieces, setPieces] = useState([{ name: "", quantity: 1 }]);

	const addPiece = () => {
		setPieces([...pieces, { name: "", quantity: 1 }]);
	};

	const updatePiece = (index, field, value) => {
		const updated = [...pieces];
		updated[index][field] = value;
		setPieces(updated);
	};

	const removePiece = (index) => {
		setPieces(pieces.filter((_, i) => i !== index));
	};

	return (
		<div className="w-full h-[calc(100vh-64px)]  px-125 flex items-center justify-center">
			{/* Cadre */}
			<div className="w-300 h-3/4 bg-secBackground rounded p-4 shadow-2xl flex flex-col">
				{/* Title */}
				<div className="flex items-center justify-between w-full mb-8">
					<div className="h-px bg-background w-1/3" />
					<h2 className="text-2xl font-bold text-foreground">
						Ajouter une Maintenance
					</h2>
					<div className="h-px bg-background w-1/3" />
				</div>
				<form className="flex flex-1 flex-col text-foreground font-medium px-4 ">
					<div className="flex mb-4">
						<label className="w-1/4 font-semibold">
							Titre de la Maintenance :
						</label>
						<input
							className="w-3/4 border px-2 py rounded"
							placeholder="Ex: Révision"
							type="text"
						/>
					</div>
					<div className="flex mb-4">
						<label className="w-1/4 font-semibold">Date :</label>
						<div className=" flex w-3/4 items-center justify-between gap-2">
							<div className="flex items-center border rounded px-2 gap-2">
								<Icon icon="mdi:calendar" className=" text-xl" />
								<input
									type="date"
									placeholder="Selectionner une date"
									className="w-full outline-none "
								/>
							</div>
							<div className="flex items-center border rounded px-2 gap-2">
								<Icon
									icon="material-symbols:speed-outline-rounded"
									className=" text-xl"
								/>
								<input
									type="number"
									placeholder="Kilométrage"
									className="w-full outline-none "
								/>
							</div>
							<div className="flex items-center border rounded px-2 gap-2">
								<Icon icon="material-symbols:euro" className=" text-xl" />
								<input
									type="number"
									placeholder="Coût total"
									className="w-full outline-none "
								/>
							</div>
						</div>
					</div>

					<div className="w-full flex">
						{/* Pieces List */}
						<div className=" shadow-2xl rounded px-4 py-1 flex flex-4 flex-col">
							<div className="flex items-center">
								<h3 className="text-xl font-semibold text-foreground w-1/3">
									Pièces Changées
								</h3>
								<div className="h-px bg-background w-2/3" />
							</div>

							{/* list */}
							<div className=" overflow-y-auto h-72 space-y-1">
								{pieces.map((piece, index) => (
									<div
										key={index}
										className="flex items-center justify-between gap-3 bg-background rounded-lg px-3 py-1"
									>
										{/* piece name */}
										<input
											type="text"
											placeholder="Nom de la pièce"
											value={piece.name}
											onChange={(e) =>
												updatePiece(index, "name", e.target.value)
											}
											className="w-2/3 outline-none"
										/>

										{/* quantity */}
										<input
											type="number"
											min="1"
											value={piece.quantity}
											onChange={(e) =>
												updatePiece(index, "quantity", e.target.value)
											}
											className="w-17 border border-secBackground rounded px-2"
										/>

										{/* delete */}
										<button
											onClick={() => removePiece(index)}
											className="text-red-500 cursor-pointer transition hover:scale-105"
										>
											<Icon icon="mdi:trash-can-outline" width="20" />
										</button>
									</div>
								))}
							</div>

							{/* add button */}
							<button
								type="button"
								onClick={addPiece}
								className="flex items-center gap-2 mt-4 bg-blue-950 text-white px-2 py-1 rounded-lg w-48"
							>
								<Icon icon="mdi:plus" />
								Ajouter une pièce
							</button>
						</div>

						<div className="pl-4  flex flex-2 ">
							<div className="border rounded border-dashed w-full border-foreground hover:bg-background flex flex-col items-center justify-center">
								<Icon icon="mdi:camera" width={64} height={64} />
								<h3 className="text-xl font-bold">Glissez une photo ici</h3>
								<span className="text-md">ou</span>
								<button className="rounded text-white py-1 px-4 bg-blue-950 cursor-pointer shadow hover:bg-blue-800 font-semibold">
									Télécharger une image
								</button>
							</div>
						</div>
					</div>
					<button
						type="submit"
						className="mt-8 w-1/2 py-1 self-center rounded text-white bg-blue-950 font-bold cursor-pointer"
					>
						Valider
					</button>
				</form>
			</div>
		</div>
	);
}
