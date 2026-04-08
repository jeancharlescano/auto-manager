
export const ContextMenu = ({
	x,
	y,
	children,
}: {
	x: number;
	y: number;
	children: React.ReactNode;
}) => {
	return (
		<div
			onClick={(e) => e.stopPropagation()}
			className={`p-2 fixed z-50 border border-background bg-secBackground rounded-lg `}
			style={{ top: y, left: x }}
		>
			{children}
		</div>
	);
};
