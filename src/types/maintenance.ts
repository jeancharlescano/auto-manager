import { Prisma } from "@/generated/prisma/client";

export type MaintenancePartForm = {
	name: string;
	quantity: number;
	price: number;
};

export type MaintenanceData = Prisma.maintenanceGetPayload<{
	include: {
		maintenance_parts: {
			include: {
				parts: true;
			};
		};
		invoices: true;
	};
}>;
