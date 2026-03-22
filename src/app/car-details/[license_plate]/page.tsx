import Image from "next/image";
import carImg from "@/assets/a5.jpg";
import Link from "next/link";
import Spec from "@/components/Spec";
import { Icon } from "@iconify/react";
import MaintenanceCard from "@/components/MaintenanceCard";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export default async function CarDetail({
	params,
}: {
	params: { license_plate: string };
}) {
	const sessionOrResponse = await requireAuth();
	const { license_plate } = await params;

	if (sessionOrResponse instanceof Response) {
		return sessionOrResponse;
	}

	const session = sessionOrResponse;

	const carData = await prisma.car.findFirst({
		where: {
			license_plate: license_plate,
			user_id: Number(session.user.id),
		},
		include: {
			maintenances: {
				orderBy: {
					maintenance_date: "desc",
				},
				include: {
					maintenance_parts: {
						include: {
							parts: true,
						},
					},
					invoices: true,
				},
			},
		},
	});
	if (!carData) return <>error</>;

	return (
		<main className="px-120 h-full w-full">
			<Link href="/" className="mt-4 ml-2 absolute left-0">
				<Icon icon="left-circle-arrow" />
			</Link>
			<div className="w-full h-110 overflow-hidden mb-8">
				<Image
					src={carImg}
					alt="car"
					className="w-full h-full object-contain object-center bg-secBackground rounded-b"
				/>
			</div>
			<div className="flex">
				<div className="w-1/4">
					<Spec
						brand={carData.brand}
						model={carData.model}
						design={carData.design || ""}
						engine={carData.engine || ""}
						fiscalPower={carData.fiscal_power || 0}
						fuelType={carData.fuel_type || ""}
						mileage={carData.mileage || 0}
						tireSize={carData.tire_size || ""}
						year={carData.year}
					/>
				</div>
				<div className="w-3/4 h-auto pl-4 self-end ">
					<Link
						href={`/car-details/${license_plate}/add-maintenance`}
						className="h-12 w-full bg-blue-950 rounded-xl flex items-center justify-center mb-8 cursor-pointer hover:scale-101 transition"
					>
						<Icon
							icon="ic:baseline-plus"
							width={48}
							height={48}
							color="white"
						></Icon>
					</Link>
					<MaintenanceCard />
					<MaintenanceCard />
					<MaintenanceCard />
					<MaintenanceCard />
				</div>
			</div>
		</main>
	);
}
