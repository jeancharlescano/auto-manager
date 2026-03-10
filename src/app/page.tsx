import Card from "@/components/Card";

export default function Home() {
	return (
		<div className=" min-h-screen bg-zinc-50 font-sans dark:bg-black max-w-screen">
			<main className="p-8 grid xl:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-x-8 gap-y-8 h-auto">
				<Card />
				<Card />
				<div className="h-72 border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer transition hover:scale-105 bg-gray-100/10">
					<h4 className="text-xl">
						Nouveau Vehicule
					</h4>
					<p className="text-sm text-gray-300">Cliquer pour ajouter votre véhicule</p>
				</div>
			</main>
		</div>
	);
}
