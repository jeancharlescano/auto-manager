import carImg from "@/assets/a5.jpg";
import Link from "next/link";
import Spec from "@/components/Spec";
import { Icon } from "@iconify/react";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import MaintenanceList from "@/components/MaintenanceList";

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
	const today = new Date();
	const maintenancesWithNextDate =
		carData?.maintenances
			.map((maintenance) => ({
				title: maintenance.title,
				nextMaintenanceDate: maintenance.next_maintenance_date,
			}))
			.filter(
				(m) => m.nextMaintenanceDate && new Date(m.nextMaintenanceDate) > today,
			)
			.sort(
				(a, b) =>
					new Date(a.nextMaintenanceDate!).getTime() -
					new Date(b.nextMaintenanceDate!).getTime(),
			) ?? [];

	if (!carData) return <>error</>;

	return (
		<main className="px-124 h-full w-full">
			<div className="relative w-full h-110 overflow-hidden mb-8">
				<img
					src={
						carData.picture_url
							? `${process.env.NEXT_PUBLIC_CDN_API_URL}${carData.picture_url}`
							: carImg.src
					}
					alt="car"
					className="w-full h-full object-contain object-center bg-secBackground rounded-b"
				/>
				<a
					href={`/api/vehicles/${license_plate}/carnet`}
					className="absolute bottom-0 right-0 text-white bg-black/20 hover:bg-black/70 px-2 py-1 rounded-tl cursor-pointer"
				>
					carnet d'entretien
				</a>
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
						carId={carData.license_plate}
					/>
				</div>
				<div className="w-3/4 h-auto pl-4 ">
					{maintenancesWithNextDate.length > 0 && (
						<div
							className={`h-16 w-full ${
								maintenancesWithNextDate[0].nextMaintenanceDate!.getTime() -
									Date.now() <=
								1000 * 60 * 60 * 24 * 30
									? "bg-red-500"
									: "bg-orange-500"
							} rounded-xl flex items-center gap-4 px-4 mb-8 transition`}
						>
							<Icon
								icon="mdi:alert-circle"
								width={36}
								height={36}
								color="white"
							/>

							<div className="flex flex-col w-full">
								<span className="text-white font-bold">
									Prochaine maintenance
								</span>
								<div className="w-full flex justify-between items-center">
									<span className="text-white text-lg font-semibold">
										{maintenancesWithNextDate[0].title}
									</span>
									<span className="text-white text-sm ">
										{maintenancesWithNextDate[0].nextMaintenanceDate!.toLocaleDateString()}
									</span>
								</div>
							</div>
						</div>
					)}
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
					<MaintenanceList
						maintenances={JSON.parse(JSON.stringify(carData.maintenances))}
					/>
				</div>
			</div>
		</main>
	);
}
