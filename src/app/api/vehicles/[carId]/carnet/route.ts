import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import archiver from "archiver";
import JSZip from "jszip";

export async function GET(
	request: Request,
	{ params }: { params: { carId: string } },
) {
	try {
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

		// =========================
		// Récupération image voiture (via ZIP CDN)
		// =========================
		let carImageBuffer: Buffer | null = null;
		let carImageType: "jpg" | "png" | null = null;

		if (car.picture_url) {
			try {
				const pathPart = car.picture_url.split("/");
				const fileName = pathPart[pathPart.length - 1];

				const folder = car.picture_type?.startsWith("image/")
					? "image"
					: "document";

				const res = await fetch(
					`${process.env.NEXT_PUBLIC_CDN_API_URL}/api/download/batch`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${process.env.CDN_TOKEN}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							files: [{ folder, name: fileName }],
						}),
					},
				);

				if (res.ok) {
					const zipBuffer = Buffer.from(await res.arrayBuffer());
					const zip = await JSZip.loadAsync(zipBuffer);

					const fileKeys = Object.keys(zip.files);
					if (fileKeys.length > 0) {
						const file = zip.files[fileKeys[0]];
						carImageBuffer = await file.async("nodebuffer");

						if (car.picture_type?.includes("png")) {
							carImageType = "png";
						} else {
							carImageType = "jpg";
						}
					}
				}
			} catch (err) {
				console.error("Erreur image voiture:", err);
			}
		}

		const pdfDoc = await PDFDocument.create();
		const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
		const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

		const maintenanceZips: { buffer: Buffer; name: string }[] = [];

		// =========================
		// PAGE 1 : COUVERTURE
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

		let y = height * 0.8;

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

		// =========================
		// IMAGE CENTRÉE
		// =========================
		if (carImageBuffer && carImageType) {
			try {
				let image;

				if (carImageType === "png") {
					image = await pdfDoc.embedPng(carImageBuffer);
				} else {
					image = await pdfDoc.embedJpg(carImageBuffer);
				}

				const imgWidth = 260;
				const imgHeight = (image.height / image.width) * imgWidth;

				page.drawImage(image, {
					x: (width - imgWidth) / 2,
					y: (height - imgHeight) / 2, // 💥 CENTRAGE PARFAIT
					width: imgWidth,
					height: imgHeight,
				});
			} catch (err) {
				console.error("Erreur embed image:", err);
			}
		}

		// Footer
		page.drawText("Auto-Manager", {
			x: padding,
			y: 30,
			size: 14,
			font: fontBold,
			color: rgb(22 / 255, 37 / 255, 86 / 255),
		});

		const dateText = `Généré le : ${new Date().toLocaleDateString()}`;
		const dateWidth = font.widthOfTextAtSize(dateText, 10);

		page.drawText(dateText, {
			x: width - dateWidth - padding,
			y: 30,
			size: 10,
			font,
		});

		// =========================
		// PAGE 2 : INFOS VOITURE
		// =========================
		page = pdfDoc.addPage([600, 800]);
		y = height - 50;

		page.drawText("Informations du véhicule", {
			x: 50,
			y,
			size: 16,
			font: fontBold,
		});
		y -= 30;

		const drawLine = (label: string, value: any) => {
			if (!value && value !== 0) return;
			page.drawText(`${label} : ${value}`, {
				x: 50,
				y,
				size: 11,
				font,
			});
			y -= 18;
		};

		drawLine("Marque", car.brand);
		drawLine("Modèle", car.model);
		drawLine("Année", car.year);
		drawLine("Plaque", car.license_plate);
		drawLine("Moteur", car.engine);
		drawLine("Carburant", car.fuel_type);
		drawLine("Puissance DIN", car.horsepower_din);
		drawLine("Puissance fiscale", car.fiscal_power);
		drawLine("Kilométrage", car.mileage);
		drawLine("Pneus", car.tire_size);
		drawLine("Couleur", car.color);
		drawLine("Design", car.design);

		// =========================
		// PAGE 3 : MAINTENANCES
		// =========================
		page = pdfDoc.addPage([600, 800]);
		y = height - 50;

		page.drawText("Historique des maintenances :", {
			x: 50,
			y,
			size: 12,
			font: fontBold,
		});
		y -= 20;

		for (const maintenance of car.maintenances) {
			const date = new Date(maintenance.maintenance_date).toLocaleDateString();

			page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1 });
			y -= 20;

			page.drawText(`- ${maintenance.title} (${date})`, {
				x: 50,
				y,
				size: 12,
				font,
			});
			y -= 15;

			if (maintenance.mileage_at_time) {
				page.drawText(`Kilométrage : ${maintenance.mileage_at_time} km`, {
					x: 60,
					y,
					size: 10,
					font,
				});
				y -= 15;
			}

			if (maintenance.total_cost) {
				page.drawText(`Coût total : ${maintenance.total_cost} €`, {
					x: 60,
					y,
					size: 10,
					font,
				});
				y -= 15;
			}

			// TABLEAU PIÈCES
			if (maintenance.maintenance_parts.length > 0) {
				page.drawText("Pièce", { x: 60, y, size: 10, font: fontBold });
				page.drawText("Qté", { x: 250, y, size: 10, font: fontBold });
				page.drawText("Prix U.", { x: 320, y, size: 10, font: fontBold });
				page.drawText("Total", { x: 420, y, size: 10, font: fontBold });
				y -= 12;

				for (const mp of maintenance.maintenance_parts) {
					const unit = Number(mp.unit_price || 0);
					const total = unit * mp.quantity;

					page.drawText(mp.parts.name, { x: 60, y, size: 9, font });
					page.drawText(`${mp.quantity}`, { x: 250, y, size: 9, font });
					page.drawText(`${unit.toFixed(2)}€`, { x: 320, y, size: 9, font });
					page.drawText(`${total.toFixed(2)}€`, { x: 420, y, size: 9, font });

					y -= 12;

					if (y < 80) {
						page = pdfDoc.addPage([600, 800]);
						y = height - 50;
					}
				}
				y -= 10;
			}

			// FACTURES ZIP
			const invoicesWithUrl = maintenance.invoices.filter((i) => i.file_url);

			if (invoicesWithUrl.length > 0) {
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
					}
				} catch (err) {
					console.error("Erreur récupération facture:", err);
				}
			}

			y -= 10;
		}

		const pdfBytes = await pdfDoc.save();

		// =====================
		// ZIP FINAL
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
