import carImg from "@/assets/a5.jpg";
import { car } from "@/generated/prisma/client";
export default function Card({ carData }: { carData: car }) {
	return (
		<div className="h-72 rounded w-full shadow-xl bg-secBackground overflow-hidden cursor-pointer transition hover:scale-[102%]">
			<div className="h-2/3 overflow-hidden relative">
				<img
					src={
						carData.picture_url
							? `${process.env.NEXT_PUBLIC_CDN_API_URL}${carData.picture_url}`
							: carImg.src
					}
					className="w-full h-full object-cover object-center"
				/>
			</div>
			<div className="h-1/3 p-2 flex flex-col justify-between">
				<div>
					<h3 className="text-foreground font-medium">
						{carData.brand} - {carData.model}
					</h3>
					<p className="text-foreground/60 font-bold">
						{carData.year} - {carData.engine}
					</p>
				</div>
				<p className="text-foreground/60 text-xs ">
					📄 Prochaine maintenance: 10/03/2026
				</p>
			</div>
		</div>
	);
}
