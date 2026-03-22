import AddMaintenance from "./AddMaintenance";

export default async function Page({
	params,
}: {
	params: Promise<{ license_plate: string }>;
}) {
	const { license_plate } = await params;

	return <AddMaintenance licensePlate={license_plate} />;
}
