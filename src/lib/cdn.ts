export const uploadImages = async (images: FormData): Promise<any> => {
	if (!images || images.entries().next().done)
		return new Response("Missing images", { status: 400 });

	const response = await fetch("/api/media/image", {
		method: "POST",
		body: images,
	});

	return response.json();
};

export const uploadFiles = async (files: FormData): Promise<any> => {
	if (!files || files.entries().next().done)
		return new Response("Missing files", { status: 400 });

	const response = await fetch("/api/media/files", {
		method: "POST",
		body: files,
	});

	return response.json();
};
