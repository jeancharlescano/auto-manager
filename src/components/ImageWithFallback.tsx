"use client";

import type { ImgHTMLAttributes, SyntheticEvent } from "react";
import { useEffect, useState } from "react";

type ImageWithFallbackProps = Omit<
	ImgHTMLAttributes<HTMLImageElement>,
	"src" | "onError"
> & {
	src: string;
	fallbackSrc: string;
	alt: string;
	onError?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
};

export default function ImageWithFallback({
	src,
	fallbackSrc,
	alt,
	onError,
	...props
}: ImageWithFallbackProps) {
	const [currentSrc, setCurrentSrc] = useState(src);

	useEffect(() => {
		setCurrentSrc(src);
	}, [src]);

	return (
		<img
			{...props}
			src={currentSrc}
			alt={alt}
			className="object-contain object-center w-full h-full"
			onError={(event) => {
				onError?.(event);

				if (currentSrc !== fallbackSrc) {
					setCurrentSrc(fallbackSrc);
				}
			}}
		/>
	);
}
