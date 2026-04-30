import carImg from "@/assets/car.png";
import Link from "next/link";
import Spec from "@/components/Spec";
import { Icon } from "@iconify/react";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import MaintenanceList from "@/components/MaintenanceList";
import ImageWithFallback from "@/components/ImageWithFallback";

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

	const carPictureSrc = carData.picture_url
		? `${process.env.NEXT_PUBLIC_CDN_API_URL}${carData.picture_url}`
		: carImg.src;

	return (
		<main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-96 h-full w-full">
			{/* Image véhicule */}
			<div className="relative w-full h-52 sm:h-72 md:h-96 lg:h-110 overflow-hidden mb-8 bg-secBackground">
				<ImageWithFallback
					src={carPictureSrc}
					fallbackSrc={carImg.src}
					alt="car"
					className="w-full h-full object-contain object-center bg-secBackground rounded-b"
				/>
				<Link
					href={`/api/vehicles/${license_plate}/carnet`}
					className="absolute bottom-0 right-0 text-white bg-black/20 hover:bg-black/70 px-2 py-1 rounded-tl cursor-pointer text-sm"
				>
					carnet d&apos;entretien
				</Link>
			</div>

			{/* Layout principal */}
			<div className="flex flex-col md:flex-row">
				{/* Spec */}
				<div className="w-full md:w-1/4 mb-4 md:mb-0">
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

				{/* Maintenances */}
				<div className="w-full md:w-3/4 h-auto md:pl-4 flex flex-col">
					<div className="flex justify-between mb-2 w-full">
						{maintenancesWithNextDate.length > 0 && (
							<div
								className={` ${
									maintenancesWithNextDate[0].nextMaintenanceDate!.getTime() -
										today.getTime() <=
									1000 * 60 * 60 * 24 * 30
										? "bg-red-700"
										: "bg-orange-700"
								} rounded-lg flex items-center gap-4 px-2  transition py-1`}
							>
								<Icon
									icon="mdi:alert-circle"
									width={24}
									height={24}
									color="white"
									className="shrink-0"
								/>
								<div className="flex items-center space-x-3 w-full text-sm">
									<span className="text-white font-semibold">
										Prochaine maintenance :
									</span>
									<span className="text-white ">
										{maintenancesWithNextDate[0].title}{" "}
										<span className="text-sm underline">
											{" "}
											{maintenancesWithNextDate[0].nextMaintenanceDate?.toLocaleDateString()}
										</span>
									</span>
								</div>
							</div>
						)}
						<Link
							href={`/car-details/${license_plate}/add-maintenance`}
							className="h-6 w-fit bg-green-700 rounded flex self-end items-center justify-center  cursor-pointer hover:scale-101 transition px-2 py-1 text-white"
						>
							<Icon
								icon="ic:baseline-plus"
								width={24}
								height={24}
								color="white"
							/>
							<p>Nouveau</p>
						</Link>
					</div>
					<MaintenanceList
						maintenances={JSON.parse(JSON.stringify(carData.maintenances))}
					/>
				</div>
			</div>
		</main>
	);
}
