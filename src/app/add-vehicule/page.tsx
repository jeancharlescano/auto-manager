import { Icon } from "@iconify/react";

export default function AddVehicule() {
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
				<form className="flex flex-col flex-1 bg-red-300 text-foreground font-medium ">
					<div className="flex w-full h-full">
						{/* formulaire */}
						<aside className="w-1/2 flex border-r">
							<aside className="w-1/2 flex flex-col justify-between items-start ">
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
									placeholder="Selectionner la marque"
									required
									className="border rounded px-2 py w-5/6"
								/>

								{/* Modèle */}
								<input
									type="text"
									required
									placeholder="Selectionner le modèle"
									className="border rounded px-2 py w-5/6"
								/>

								{/* Année */}

								<input
									type="number"
									placeholder="Selectionner l'année"
									className="border rounded px-2 py w-5/6"
									required
								/>

								{/* Motorisation */}

								<input
									type="text"
									placeholder="Selectionner la motorisation"
									className="border rounded px-2 py w-5/6"
								/>

								{/* Carburant */}

								<input
									type="text"
									placeholder="Selectionner la "
									className="border rounded px-2 py w-5/6"
								/>

								{/* Puissance DIN*/}

								<input
									type="number"
									placeholder="Puissance DIN (ch)"
									className="border rounded px-2 py w-5/6"
								/>
								{/* Puissance */}

								<input
									type="number"
									placeholder="Puissance (ch)"
									className="border rounded px-2 py w-5/6"
								/>

								{/* Taille des pneus */}

								<input
									type="text"
									placeholder="Ex: 205/55 R16"
									className="border rounded px-2 py w-5/6"
								/>

								{/* Couleur */}

								<input
									type="text"
									placeholder="Selectionner la couleur"
									className="border rounded px-2 py w-5/6"
								/>

								{/* Design */}

								<input
									type="text"
									placeholder="Selectionner le Design"
									className="border rounded px-2 py w-5/6"
								/>

								{/* Kilométrage */}

								<input
									type="number"
									placeholder="Kilométrage (km)"
									className="border rounded px-2 py w-5/6"
								/>
							</aside>
						</aside>

						{/* image */}
						<aside className="w-1/2  pl-21 border-l">
							<div className="w-full border border-dashed hover:bg-background h-full flex justify-center items-center rounded ">
								<div className="flex flex-col w-3/4 items-center ">
									<Icon icon="mdi:camera" width={64} height={64} />
									<h3 className="text-xl font-bold">Glissez une photo ici</h3>
									<span className="text-md">ou</span>
									<button className="rounded text-white py-1 px-4 bg-blue-950 cursor-pointer shadow hover:bg-blue-800 font-semibold">
										Télécharger une image
									</button>
								</div>
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
