interface ImagePlaceholderProps {
	label?: string;
	aspect?: string;
	className?: string;
	labelClassName?: string;
}

export default function ImagePlaceholder({
	label = "[Image]",
	aspect = "4/3",
	className = "",
	labelClassName = "text-body",
}: ImagePlaceholderProps) {
	return (
		<div
			className={`flex items-center justify-center bg-gray-200 ${className}`}
			style={{ aspectRatio: aspect }}
		>
			<span className={`font-mono text-gray-500 ${labelClassName}`}>
				{label}
			</span>
		</div>
	);
}
