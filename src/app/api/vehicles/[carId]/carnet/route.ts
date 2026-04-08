import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import archiver from "archiver";

export async function GET(
	request: Request,
	{ params }: { params: { carId: string } },
) {
	try {
		// 🔐 AUTH
		const sessionOrResponse = await requireAuth();
		if (sessionOrResponse instanceof Response) return sessionOrResponse;

		const { carId } = await params;

		const car = await prisma.car.findUnique({
			where: {
				license_plate: carId,
				user_id: Number(sessionOrResponse.user.id),
			},
			include: {
				maintenances: {
					include: {
						invoices: true,
						maintenance_parts: { include: { parts: true } },
					},
					orderBy: { maintenance_date: "asc" },
				},
			},
		});

		if (!car) return new Response("Car not found", { status: 404 });

		const pdfDoc = await PDFDocument.create();
		const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
		const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

		// =========================
		// Première page : titre avec retour à la ligne
		// =========================
		let page = pdfDoc.addPage([600, 800]);
		const { width, height } = page.getSize();

		const padding = 40;
		const headerText = `Carnet d'entretien - ${car.brand} ${car.model} ${car.year} - ${car.license_plate}`;
		const headerSize = 28;
		const words = headerText.split(" ");
		let lines: string[] = [];
		let currentLine = "";

		for (const word of words) {
			const testLine = currentLine ? currentLine + " " + word : word;
			const testWidth = fontBold.widthOfTextAtSize(testLine, headerSize);
			if (testWidth > width - padding * 2) {
				lines.push(currentLine);
				currentLine = word;
			} else {
				currentLine = testLine;
			}
		}
		if (currentLine) lines.push(currentLine);

		// Dessiner les lignes centrées
		let y = height * 0.65;
		for (const line of lines) {
			const lineWidth = fontBold.widthOfTextAtSize(line, headerSize);
			page.drawText(line, {
				x: (width - lineWidth) / 2,
				y,
				size: headerSize,
				font: fontBold,
			});
			y -= headerSize + 8;
		}

		// Auto-Manager en bas à gauche
		const siteName = "Auto-Manager";
		page.drawText(siteName, {
			x: padding,
			y: 30,
			size: 14,
			font: fontBold,
			color: rgb(22 / 255, 37 / 255, 86 / 255),
		});

		// Date en bas à droite
		const dateText = `Généré le : ${new Date().toLocaleDateString()}`;
		const dateSize = 10;
		const dateWidth = font.widthOfTextAtSize(dateText, dateSize);
		page.drawText(dateText, {
			x: width - dateWidth - padding,
			y: 30,
			size: dateSize,
			font,
		});

		// =========================
		// Deuxième page : historique maintenances
		// =========================
		page = pdfDoc.addPage([600, 800]);
		y = height - 50;

		page.drawText("Historique des maintenances :", {
			x: 50,
			y,
			size: 12,
			font,
		});
		y -= 20;

		const maintenanceZips: { buffer: Buffer; name: string }[] = [];

		for (const maintenance of car.maintenances) {
			const date = new Date(maintenance.maintenance_date).toLocaleDateString();

			// Spacer / séparation
			page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1 });
			y -= 20;

			// Titre maintenance
			page.drawText(`- ${maintenance.title} (${date})`, {
				x: 50,
				y,
				size: 12,
				font,
			});
			y -= 15;

			// Kilométrage
			if (maintenance.mileage_at_time != null) {
				page.drawText(`Kilométrage : ${maintenance.mileage_at_time} km`, {
					x: 60,
					y,
					size: 10,
					font,
				});
				y -= 15;
			}

			// Coût total
			if (maintenance.total_cost) {
				page.drawText(`Coût total : ${maintenance.total_cost} €`, {
					x: 60,
					y,
					size: 10,
					font,
				});
				y -= 15;
			}

			// Pièces sous forme de tableau
			if (maintenance.maintenance_parts.length > 0) {
				page.drawText(`Pièce`, { x: 60, y, size: 10, font: fontBold });
				page.drawText(`Qté`, { x: 250, y, size: 10, font: fontBold });
				page.drawText(`Prix U.`, { x: 300, y, size: 10, font: fontBold });
				page.drawText(`Total`, { x: 400, y, size: 10, font: fontBold });
				y -= 12;

				for (const mp of maintenance.maintenance_parts) {
					const partName = mp.parts.name;
					const qty = mp.quantity;
					const unitPrice = mp.unit_price ? Number(mp.unit_price) : 0;
					const total = qty * unitPrice;

					page.drawText(`${partName}`, { x: 60, y, size: 9, font });
					page.drawText(`${qty}`, { x: 250, y, size: 9, font });
					page.drawText(`${unitPrice.toFixed(2)}€`, {
						x: 300,
						y,
						size: 9,
						font,
					});
					page.drawText(`${total.toFixed(2)}€`, { x: 400, y, size: 9, font });
					y -= 12;

					if (y < 80) {
						page = pdfDoc.addPage([600, 800]);
						y = height - 50;
					}
				}
				y -= 10; // espace après le tableau
			}

			// Documents
			const invoicesWithUrl = maintenance.invoices.filter((i) => i.file_url);
			if (invoicesWithUrl.length > 0) {
				page.drawText(`Documents : ${invoicesWithUrl.length} fichier(s)`, {
					x: 60,
					y,
					size: 10,
					font,
				});
				y -= 12;

				const filesForCDN = invoicesWithUrl.map((invoice) => {
					const folder = invoice.type?.startsWith("application/")
						? "document"
						: invoice.type?.split("/")[0];
					const pathPart = invoice.file_url!.split("/");
					return { folder, name: pathPart[pathPart.length - 1] };
				});

				try {
					const res = await fetch(
						`${process.env.NEXT_PUBLIC_CDN_API_URL}/api/download/batch`,
						{
							method: "POST",
							headers: {
								Authorization: `Bearer ${process.env.CDN_TOKEN}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ files: filesForCDN }),
						},
					);

					if (res.ok) {
						const buffer = Buffer.from(await res.arrayBuffer());
						const folderName = `${maintenance.title.replace(/\s+/g, "_")}_${
							new Date(maintenance.maintenance_date).toISOString().split("T")[0]
						}`;

						maintenanceZips.push({ buffer, name: `${folderName}.zip` });
					} else {
						console.error(
							"Erreur CDN batch pour la maintenance",
							maintenance.id,
						);
					}
				} catch (err) {
					console.error("Erreur récupération maintenance:", err);
				}
			}

			y -= 10;
		}

		const pdfBytes = await pdfDoc.save();

		// =====================
		// Création ZIP final
		// =====================
		const stream = new ReadableStream({
			async start(controller) {
				const archive = archiver("zip", { zlib: { level: 9 } });
				archive.on("data", (chunk) => controller.enqueue(chunk));
				archive.on("end", () => controller.close());
				archive.on("error", (err) => controller.error(err));

				archive.append(Buffer.from(pdfBytes), {
					name: `carnet_${car.license_plate}.pdf`,
				});

				for (const m of maintenanceZips) {
					archive.append(m.buffer, { name: m.name });
				}

				await archive.finalize();
			},
		});

		return new Response(stream, {
			headers: {
				"Content-Type": "application/zip",
				"Content-Disposition": `attachment; filename="carnet_${car.license_plate}.zip"`,
			},
		});
	} catch (err: any) {
		console.error(err);
		return new Response(err.message, { status: 500 });
	}
}
