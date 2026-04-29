import type { car } from "@/generated/prisma/client";

export type NextMaintenanceSummary = {
	id: number;
	title: string;
	next_maintenance_date: Date | string | null;
};

export type CarWithNextMaintenance = car & {
	maintenances: NextMaintenanceSummary[];
};
