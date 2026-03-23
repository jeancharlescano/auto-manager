"use client";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function AddVehicule() {
	const router = useRouter();
	console.log(process.env.NEXT_PUBLIC_FILERAPIURL);
	const [plate, setPlate] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const brand = useRef<HTMLInputElement>(null);
	const model = useRef<HTMLInputElement>(null);
	const year = useRef<HTMLInputElement>(null);
	const motorization = useRef<HTMLInputElement>(null);
	const fuel = useRef<HTMLInputElement>(null);
	const dinPower = useRef<HTMLInputElement>(null);
	const power = useRef<HTMLInputElement>(null);
	const tires = useRef<HTMLInputElement>(null);
	const color = useRef<HTMLInputElement>(null);
	const design = useRef<HTMLInputElement>(null);
	const mileage = useRef<HTMLInputElement>(null);

	const handleAddDash = (value: string) => {
		let cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

		if (cleaned.length > 2 && cleaned.length <= 5) {
			cleaned = cleaned.slice(0, 2) + "-" + cleaned.slice(2);
		} else if (cleaned.length > 5) {
			cleaned =
				cleaned.slice(0, 2) +
				"-" +
				cleaned.slice(2, 5) +
				"-" +
				cleaned.slice(5, 7);
		}

		setPlate(cleaned);
	};

	const handleFiles = (file: File) => {
		setFile(file);

		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFiles(e.dataTransfer.files[0]);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			handleFiles(e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!file) return;

		const formData = new FormData();
		formData.append("image", file);

		let response = await fetch(
			`${process.env.NEXT_PUBLIC_FILERAPIURL}/api/upload`,
			{
				method: "POST",
				body: formData,
			},
		);

		let data = await response.json();
		let imageUrl = data.files[0].url;

		response = await fetch("/api/vehicles", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				licensePlate: plate,
				brand: brand.current?.value,
				model: model.current?.value,
				year: Number(year.current?.value),
				engine: motorization.current?.value,
				fuelType: fuel.current?.value,
				powerDin: Number(dinPower.current?.value),
				powerFiscal: Number(power.current?.value),
				tireSize: tires.current?.value,
				color: color.current?.value,
				design: design.current?.value,
				mileage: Number(mileage.current?.value),
				pictureUrl: imageUrl,
			}),
		});
		data = await response.json();
		console.log(data);

		if (response?.ok) {
			router.push("/");
		} else {
			alert("Erreur lors de la création de la voiture");
		}
	};

	return (
		<div className="w-full h-[calc(100vh-64px)]  px-125 flex items-center justify-center">
			{/* Cadre */}
			<div className="w-300 h-3/4 bg-secBackground rounded p-4 shadow-2xl flex flex-col">
				{/* Title */}
				<div className="flex items-center justify-between w-full mb-8">
					<div className="h-px bg-foreground w-1/3"></div>
					<h2 className="text-2xl font-bold text-foreground">
						Ajouter un véhicule
					</h2>
					<div className="h-px bg-foreground w-1/3"></div>
				</div>
				<form
					className="flex flex-col flex-1 text-foreground font-medium "
					onSubmit={handleSubmit}
				>
					<div className="flex w-full h-full">
						{/* formulaire */}
						<aside className="w-1/2 flex border-r">
							<aside className="w-1/2 flex flex-col justify-between items-start ">
								<label className="text-foreground">Immatriculation :</label>
								<label className="text-foreground">Marque :</label>
								<label className="text-foreground">Modèle :</label>
								<label className="text-foreground">Année :</label>
								<label className="text-foreground">Motorisation :</label>
								<label className="text-foreground">Carburant :</label>
								<label className="text-foreground">Puissance (DIN):</label>
								<label className="text-foreground">Puissance (Fiscaux):</label>
								<label className="text-foreground">Taille des pneus :</label>
								<label className="text-foreground">Couleur :</label>
								<label className="text-foreground">Design :</label>
								<label className="text-foreground">Kilométrage :</label>
							</aside>
							<aside className="w-1/2 flex flex-col justify-between items-start ">
								{/* Marque */}
								<input
									type="text"
									placeholder="Saissiez votre immatriculation"
									onChange={(e) => handleAddDash(e.target.value)}
									value={plate}
									required
									maxLength={9}
									className="border rounded px-2 py w-5/6"
								/>
								<input
									type="text"
									placeholder="Selectionner la marque"
									ref={brand}
									required
									className="border rounded px-2 py w-5/6"
								/>

								{/* Modèle */}
								<input
									type="text"
									required
									ref={model}
									placeholder="Selectionner le modèle"
									className="border rounded px-2 py w-5/6"
								/>

								{/* Année */}

								<input
									type="number"
									ref={year}
									placeholder="Selectionner l'année"
									className="border rounded px-2 py w-5/6"
									required
								/>

								{/* Motorisation */}

								<input
									type="text"
									ref={motorization}
									placeholder="Selectionner la motorisation"
									className="border rounded px-2 py w-5/6"
								/>

								{/* Carburant */}

								<input
									type="text"
									ref={fuel}
									placeholder="Selectionner la "
									className="border rounded px-2 py w-5/6"
								/>

								{/* Puissance DIN*/}

								<input
									type="number"
									ref={dinPower}
									placeholder="Puissance DIN (ch)"
									className="border rounded px-2 py w-5/6"
								/>
								{/* Puissance */}

								<input
									type="number"
									ref={power}
									placeholder="Puissance (ch)"
									className="border rounded px-2 py w-5/6"
								/>

								{/* Taille des pneus */}

								<input
									type="text"
									ref={tires}
									placeholder="Ex: 205/55 R16"
									className="border rounded px-2 py w-5/6"
								/>

								{/* Couleur */}

								<input
									type="text"
									ref={color}
									placeholder="Selectionner la couleur"
									className="border rounded px-2 py w-5/6"
								/>

								{/* Design */}

								<input
									type="text"
									ref={design}
									placeholder="Selectionner le Design"
									className="border rounded px-2 py w-5/6"
								/>

								{/* Kilométrage */}

								<input
									type="number"
									ref={mileage}
									placeholder="Kilométrage (km)"
									className="border rounded px-2 py w-5/6"
								/>
							</aside>
						</aside>

						{/* image */}
						<aside className="w-1/2  pl-21 border-l">
							<div
								onDragOver={(e) => e.preventDefault()}
								onDrop={handleDrop}
								onClick={() => inputRef.current?.click()}
								className="w-full border border-dashed hover:bg-background h-full flex justify-center items-center rounded cursor-pointer"
							>
								{preview ? (
									<>
										<img
											src={preview}
											alt="preview"
											className="max-h-full max-w-full object-contain rounded"
										/>
										<input
											ref={inputRef}
											type="file"
											accept="image/*"
											onChange={handleChange}
											className="hidden"
										/>
									</>
								) : (
									<div className="flex flex-col w-3/4 items-center">
										<Icon icon="mdi:camera" width={64} height={64} />
										<h3 className="text-xl font-bold">Glissez une photo ici</h3>
										<span className="text-md">ou</span>
										<h3 className="text-xl font-bold">Cliquez</h3>

										<input
											ref={inputRef}
											type="file"
											accept="image/*"
											onChange={handleChange}
											className="hidden"
										/>
									</div>
								)}
							</div>
						</aside>
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
