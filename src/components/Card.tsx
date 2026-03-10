import Image from "next/image";
import car from "@/assets/image.png"
export default function Card() {
	return (
		<div className="h-72 rounded w-full shadow-md dark:shadow-white dark:bg-white overflow-hidden cursor-pointer transition hover:scale-105">
			<div className="h-2/3 overflow-hidden border-b border-gray-300">
				<Image src={car} alt="car" className="w-full h-full object-cover object-center" />
			</div>
			<div className="h-1/3 p-2 flex flex-col justify-between">
				<div>
					<h3 className="text-black font-medium">
						Audi A5
					</h3>
					<p className="text-gray-600 font-bold">2016 - S-Tronic</p>
				</div>
				<p className="text-gray-600 text-xs ">📄 Prochaine maintenance: 10/03/2026</p>
			</div>
		</div>
	)
}