interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface NtsHeaderProps {
	breadcrumb?: BreadcrumbItem[];
}

export default function NtsHeader({ breadcrumb }: NtsHeaderProps) {
	return (
		<div className="border-b-2 border-gray-300">
			<div className="flex items-center justify-between bg-white px-6 py-3">
				<div className="flex items-center gap-8">
					<div className="flex items-center gap-2">
						<div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-400 bg-gray-200">
							<span className="font-mono text-[8px] font-bold text-gray-500">
								NTS
							</span>
						</div>
						<span className="font-mono text-label font-bold uppercase leading-tight tracking-wider text-gray-700">
							National Trust
							<br />
							for Scotland
						</span>
					</div>
					<div className="hidden items-center gap-5 md:flex">
						{["Visit", "What we do", "Support us", "Stories", "Shop"].map(
							(item) => (
								<span
									key={item}
									className="font-mono text-label font-medium uppercase tracking-[0.08em] text-gray-600"
								>
									{item}
								</span>
							),
						)}
					</div>
				</div>
				<div className="flex items-center gap-3">
					<span className="font-mono text-label text-gray-500">⌕ Search</span>
					<span className="font-mono text-label text-gray-500">My Trust</span>
					<div className="bg-yellow-400 px-4 py-1.5">
						<span className="font-mono text-label font-bold uppercase text-black">
							Join Now
						</span>
					</div>
				</div>
			</div>
			{breadcrumb && (
				<div className="bg-gray-50 px-6 py-2">
					<span className="font-mono text-meta text-gray-500">
						{breadcrumb.map((crumb, i) => (
							<span key={crumb.label}>
								{i > 0 && " › "}
								{crumb.href ? (
									<a
										href={crumb.href}
										className="text-gray-400 underline hover:text-gray-600"
									>
										{crumb.label}
									</a>
								) : (
									<span
										className={
											i < breadcrumb.length - 1
												? "text-gray-400"
												: "text-gray-600"
										}
									>
										{crumb.label}
									</span>
								)}
							</span>
						))}
					</span>
				</div>
			)}
		</div>
	);
}
