import Image from "next/image";
import car from "@/assets/a5.jpg";
import Link from "next/link";
import Spec from "@/components/Spec";
import { Icon } from "@iconify/react";
import MaintenanceCard from "@/components/MaintenanceCard";
export default function CarDetail() {
	return (
		<main className="px-120 h-full w-full">
			<Link href="/" className="mt-4 ml-2 absolute left-0">
				<Icon icon="left-circle-arrow" />
			</Link>
			<div className="w-full h-110 overflow-hidden mb-8">
				<Image
					src={car}
					alt="car"
					className="w-full h-full object-contain object-center bg-[#343434] rounded-b"
				/>
			</div>
			<div className="flex">
				<div className="w-1/4">
					<Spec />
				</div>
				<div className="w-3/4 h-auto px-4">
					<MaintenanceCard />
					<MaintenanceCard />
					<MaintenanceCard />
					<MaintenanceCard />
				</div>
			</div>
		</main>
	);
}
