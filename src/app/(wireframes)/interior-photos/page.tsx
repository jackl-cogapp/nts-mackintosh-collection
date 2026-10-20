"use client";

import { type ReactNode, Suspense, useEffect, useState } from "react";
import {
	Container,
	ImagePlaceholder,
	WireframeSection,
	usePageVariations,
} from "@/components/wireframe";
import { ScopePage } from "@/providers/ScopeProvider";

const VARIATIONS = [
	{ key: "sidebar", label: "Sidebar" },
	{ key: "full-width", label: "Full width" },
	{ key: "more-details", label: "More details" },
] as const;

// ── Mock item ───────────────────────────────────────────────────────────

const ITEM = {
	objectNumber: "2.27.1",
	objectName: "Standard Lamp",
	description: [
		"A standard lamp made from sycamore and fruitwood which was designed by Charles Rennie Mackintosh and made by John Craig. The lamp has a rectangular top enclosing a silvered reservoir and is inlaid with rectangular panels of mother-of-pearl. The lamp is supported by four square columns which are joined by stretchers repeating the motif.",
	],
	showMoreDescription: "",
	creators: [
		{ name: "Charles Rennie Mackintosh", role: "Designer" },
		{ name: "John Craig", role: "Maker" },
	],
	period: "Early 20th century",
	date: "1905",
	onDisplay: false,
	acquisition: "",
	category: "Furniture",
	materials: ["Sycamore", "Mother of Pearl"],
	dimensions: { height: "140 cm", width: null, depth: null },
	themes: ["Lighting", "Interiors"],
	associatedPeople: ["Walter Blackie"],
	provenance:
		"Commissioned by Walter Blackie for The Hill House, Helensburgh; remained in the house until it passed to the National Trust for Scotland.",
	acquisitionDate: "1982",
	isArchive: false,
	thumbnails: 3,
	room: {
		name: "The Drawing Room",
		property: "The Hill House, Helensburgh",
		caption: "Beside the window bay in the drawing room.",
	},
};

// ── Helpers ─────────────────────────────────────────────────────────────

// ── Sub-components ──────────────────────────────────────────────────────

function Dash() {
	return <span className="text-gray-400">—</span>;
}

function Measurements() {
	const { height, width, depth } = ITEM.dimensions;
	const parts = [
		height && `Height: ${height}`,
		width && `Width: ${width}`,
		depth && `Depth: ${depth}`,
	].filter(Boolean);
	return parts.length > 0 ? <>{parts.join(", ")}</> : <Dash />;
}

function ObjectInfoField({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<p className="font-mono text-body font-semibold text-gray-900 mb-1">
				{label}
			</p>
			<div className="font-mono text-body text-gray-700">{children}</div>
		</div>
	);
}

function LinkList({ items }: { items: ReactNode[] }) {
	return items.length > 0 ? (
		<>
			{items.map((item, i) => (
				<span key={i}>
					{item}
					{i < items.length - 1 ? ", " : ""}
				</span>
			))}
		</>
	) : (
		<Dash />
	);
}

function FieldLink({ children }: { children: ReactNode }) {
	return (
		<a href="#" className="underline text-gray-700 hover:text-black">
			{children}
		</a>
	);
}

// MVP object information: four headline fields, the rest behind "More details"
function ObjectInfoFields({ extra }: { extra?: ReactNode }) {
	const [expanded, setExpanded] = useState(false);
	return (
		<div className="max-w-prose">
			<div className="grid grid-cols-2 gap-x-8 gap-y-6">
				<ObjectInfoField label="Date">{ITEM.date}</ObjectInfoField>
				<ObjectInfoField label="Maker/Creator">
					<LinkList
						items={ITEM.creators.map((c) => (
							<>
								<FieldLink>{c.name}</FieldLink> ({c.role})
							</>
						))}
					/>
				</ObjectInfoField>
				<ObjectInfoField label="Materials">
					<LinkList
						items={ITEM.materials.map((m) => <FieldLink>{m}</FieldLink>)}
					/>
				</ObjectInfoField>
				<ObjectInfoField label="Measurements">
					<Measurements />
				</ObjectInfoField>
			</div>

			{expanded && (
				<div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-gray-200 pt-6">
					<ObjectInfoField label="On display">
						{ITEM.onDisplay ? "Yes" : "No"}
					</ObjectInfoField>
					<ObjectInfoField label="Category">
						{ITEM.category ? <FieldLink>{ITEM.category}</FieldLink> : <Dash />}
					</ObjectInfoField>
					<ObjectInfoField label="Themes">
						<LinkList
							items={ITEM.themes.map((th) => <FieldLink>{th}</FieldLink>)}
						/>
					</ObjectInfoField>
					<ObjectInfoField label="Associated person">
						<LinkList
							items={ITEM.associatedPeople.map((ap) => (
								<FieldLink>{ap}</FieldLink>
							))}
						/>
					</ObjectInfoField>
					<div className="col-span-2">
						<ObjectInfoField label="Provenance">
							{ITEM.provenance || <Dash />}
						</ObjectInfoField>
					</div>
					<ObjectInfoField label="Acquisition date">
						{ITEM.acquisitionDate || <Dash />}
					</ObjectInfoField>
					<ObjectInfoField
						label={ITEM.isArchive ? "Archive number" : "Object number"}
					>
						{ITEM.objectNumber}
					</ObjectInfoField>
					{extra && <div className="col-span-2">{extra}</div>}
				</div>
			)}

			<button
				type="button"
				onClick={() => setExpanded((e) => !e)}
				aria-expanded={expanded}
				className="mt-6 flex items-center gap-1 font-mono text-meta text-gray-600 underline hover:text-black"
			>
				{expanded ? "▲ Fewer details" : "▼ More details"}
			</button>
		</div>
	);
}

// ── Room photo zoom lightbox ────────────────────────────────────────────

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;

function LightboxButton({
	label,
	disabled,
	onClick,
	children,
}: {
	label: string;
	disabled?: boolean;
	onClick: () => void;
	children: ReactNode;
}) {
	return (
		<button
			type="button"
			aria-label={label}
			title={label}
			disabled={disabled}
			onClick={onClick}
			className="min-w-8 border border-gray-500 px-2 py-1 font-mono text-meta text-white hover:border-white disabled:opacity-30"
		>
			{children}
		</button>
	);
}

function RoomZoomLightbox({ onClose }: { onClose: () => void }) {
	const [zoom, setZoom] = useState(1);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label={`${ITEM.room.name}, zoomable photo`}
			className="fixed inset-0 z-[100] flex flex-col bg-gray-900/95"
		>
			<div className="flex items-center justify-between gap-4 px-4 py-3">
				<p className="font-mono text-meta text-white">
					{ITEM.room.name}, {ITEM.room.property}
				</p>
				<div className="flex items-center gap-1">
					<LightboxButton
						label="Zoom out"
						disabled={zoom <= ZOOM_MIN}
						onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - 0.5))}
					>
						−
					</LightboxButton>
					<span className="w-14 text-center font-mono text-label text-gray-300 tabular-nums">
						{Math.round(zoom * 100)}%
					</span>
					<LightboxButton
						label="Zoom in"
						disabled={zoom >= ZOOM_MAX}
						onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + 0.5))}
					>
						+
					</LightboxButton>
					<LightboxButton label="Reset zoom" onClick={() => setZoom(1)}>
						Reset
					</LightboxButton>
					<LightboxButton label="Close" onClick={onClose}>
						✕
					</LightboxButton>
				</div>
			</div>
			<div className="flex flex-1 items-center justify-center overflow-auto p-4">
				<div
					className="w-full max-w-5xl origin-center"
					style={{ transform: `scale(${zoom})` }}
				>
					<ImagePlaceholder
						className="w-full"
						aspect="16/9"
						label="[Interior photo, pan and pinch to zoom]"
					/>
				</div>
			</div>
		</div>
	);
}

// ── Page ────────────────────────────────────────────────────────────────

function InteriorPhotosContent() {
	const variation = usePageVariations(VARIATIONS);
	const [showMore, setShowMore] = useState(false);
	const [activeThumb, setActiveThumb] = useState(0);
	const [roomZoomOpen, setRoomZoomOpen] = useState(false);

	const relatedByCreator = [
		{ title: "Pinks", date: "1915", objectType: "Watercolour" },
		{
			title: "Hill House, Ground Floor Plan",
			date: "1902",
			objectType: "Architectural Drawing",
		},
		{ title: "Ladder-back Chair", date: "1903", objectType: "Furniture" },
		{
			title: "Glasgow School of Art, North Elevation",
			date: "1897",
			objectType: "Architectural Drawing",
		},
	];

	return (
		<ScopePage id="interior-photos">
			<div className="min-h-screen bg-white">
				<div className="border-b border-gray-200 px-6 pt-8 pb-0 text-center">
					<Container size="lg">
						<h1 className="font-mono text-display font-medium tracking-tight text-gray-900 mb-8">
							{ITEM.objectName}
						</h1>
					</Container>
				</div>

				{/* ── Burns style: image viewer full-width, then 2-col below ── */}
				<WireframeSection
					label="Image viewer"
					className="border-b border-gray-200 bg-gray-50 px-6 py-8"
				>
					<Container size="lg">
						<div className="relative">
							<ImagePlaceholder
								className="w-full aspect-[4/3] max-h-[500px]"
								label={`[Image ${activeThumb + 1} of ${ITEM.thumbnails}]`}
							/>
							<div className="absolute top-2 left-2 flex flex-col gap-0.5 sm:gap-1">
								{["[ ]", "[+]", "[-]", "[~]", "[|]", "[↓]", "[🔒]"].map(
									(ctrl, i) => (
										<button
											key={i}
											type="button"
											className="flex h-6 w-6 items-center justify-center border border-gray-300 bg-white/80 font-mono text-label text-gray-500 hover:border-gray-500 hover:bg-white sm:h-7 sm:w-7"
										>
											{ctrl}
										</button>
									),
								)}
							</div>
							<div className="flex flex-wrap items-center justify-center gap-3 mt-4">
								<button
									type="button"
									className="border border-gray-300 px-3 py-1.5 font-mono text-meta hover:bg-gray-100 disabled:opacity-30"
									disabled={activeThumb === 0}
									onClick={() => setActiveThumb((t) => t - 1)}
								>
									←
								</button>
								{Array.from({ length: ITEM.thumbnails }, (_, i) => (
									<button
										key={i}
										type="button"
										onClick={() => setActiveThumb(i)}
										className={`w-20 h-20 border-2 ${activeThumb === i ? "border-gray-800" : "border-gray-300 hover:border-gray-500"}`}
									>
										<ImagePlaceholder
											className="w-full h-full"
											labelClassName="text-label"
										/>
									</button>
								))}
								<button
									type="button"
									className="border border-gray-300 px-3 py-1.5 font-mono text-meta hover:bg-gray-100 disabled:opacity-30"
									disabled={activeThumb === ITEM.thumbnails - 1}
									onClick={() => setActiveThumb((t) => t + 1)}
								>
									→
								</button>
							</div>
							<p className="text-center font-mono text-label text-gray-400 mt-2">
								Image {activeThumb + 1} of {ITEM.thumbnails}
							</p>
						</div>
					</Container>
				</WireframeSection>

				<div className="border-b border-gray-200 px-6 py-10">
					<Container size="lg">
						<div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
							<div className="order-first flex w-full flex-col gap-10 lg:order-last lg:w-56 lg:shrink-0">
								<WireframeSection label="Key details">
									<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-4">
										Key details
									</h2>
									{/* Fields to be decided */}
									<div className="flex items-center justify-center border-2 border-gray-300 py-16">
										<p className="font-mono text-page font-semibold tracking-tight text-gray-400">
											TBD
										</p>
									</div>
								</WireframeSection>

								{/* In the room: small photo in the sidebar */}
								{variation === "sidebar" && (
									<WireframeSection label="In the room">
										<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-1">
											In the room
										</h2>
										<p className="mb-4 font-mono text-meta text-gray-500">
											{ITEM.room.name}, {ITEM.room.property}
										</p>
										<button
											type="button"
											onClick={() => setRoomZoomOpen(true)}
											aria-label={`Zoom photo of ${ITEM.room.name}`}
											className="group relative block w-full"
										>
											<ImagePlaceholder
												className="w-full"
												aspect="4/3"
												label="[Room photo]"
											/>
											<span className="absolute right-2 bottom-2 border border-gray-400 bg-white px-1.5 py-0.5 font-mono text-label text-gray-700 group-hover:border-gray-800">
												⤢ Zoom
											</span>
										</button>
										<p className="mt-3 font-mono text-label leading-[1.6] text-gray-600">
											{ITEM.room.caption}
										</p>
									</WireframeSection>
								)}
							</div>
							<div className="min-w-0 flex-1">
								<WireframeSection label="Description">
									<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-4">
										Description
									</h2>
									<div className="space-y-4 max-w-prose">
										{ITEM.description.map((para, i) => (
											<p
												key={i}
												className="font-mono text-body text-gray-700 leading-[1.7]"
											>
												{para}
											</p>
										))}
										{showMore && ITEM.showMoreDescription && (
											<p className="font-mono text-body text-gray-700 leading-[1.7]">
												{ITEM.showMoreDescription}
											</p>
										)}
									</div>
									{ITEM.showMoreDescription && (
										<button
											type="button"
											onClick={() => setShowMore((s) => !s)}
											className="mt-4 font-mono text-meta text-gray-600 underline hover:text-black flex items-center gap-1"
										>
											{showMore ? "▲ Show less" : "▼ Show more"}
										</button>
									)}
								</WireframeSection>

								<WireframeSection label="Object information" className="mt-10">
									<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-6">
										Object information
									</h2>
									<ObjectInfoFields
										extra={
											variation === "more-details" && (
												<ObjectInfoField label="In the room">
													<p className="mb-3">
														{ITEM.room.name}, {ITEM.room.property}
													</p>
													<button
														type="button"
														onClick={() => setRoomZoomOpen(true)}
														aria-label={`Zoom photo of ${ITEM.room.name}`}
														className="group relative block w-full"
													>
														<ImagePlaceholder
															className="w-full"
															aspect="16/9"
															label="[Room photo]"
														/>
														<span className="absolute right-2 bottom-2 border border-gray-400 bg-white px-1.5 py-0.5 font-mono text-label text-gray-700 group-hover:border-gray-800">
															⤢ Zoom
														</span>
													</button>
													<p className="mt-2 font-mono text-meta text-gray-500">
														{ITEM.room.caption}
													</p>
												</ObjectInfoField>
											)
										}
									/>
								</WireframeSection>
							</div>
						</div>
					</Container>
				</div>

				{/* In the room: large full-width photo */}
				{variation === "full-width" && (
					<WireframeSection
						label="In the room"
						className="border-b border-gray-200 px-6 py-10"
					>
						<Container size="lg">
							<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-1">
								In the room
							</h2>
							<p className="mb-6 font-mono text-meta text-gray-500">
								{ITEM.room.name}, {ITEM.room.property}
							</p>
							<button
								type="button"
								onClick={() => setRoomZoomOpen(true)}
								aria-label={`Zoom photo of ${ITEM.room.name}`}
								className="group relative block w-full"
							>
								<ImagePlaceholder
									className="w-full"
									aspect="16/9"
									label="[Interior photo of the room]"
								/>
								<span className="absolute right-3 bottom-3 border border-gray-400 bg-white px-2 py-1 font-mono text-meta text-gray-700 group-hover:border-gray-800">
									⤢ Zoom
								</span>
							</button>
							<p className="mt-4 max-w-prose font-mono text-meta leading-[1.6] text-gray-600">
								{ITEM.room.caption}
							</p>
						</Container>
					</WireframeSection>
				)}

				{/* More by this creator */}
				<WireframeSection
					label="More by this creator"
					className="border-b border-gray-200 px-6 py-10"
				>
					<Container size="lg">
						<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-6">
							You might also like
						</h2>
						<div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
							{relatedByCreator.map((obj, i) => (
								<a
									key={i}
									href="#"
									className="group flex flex-col gap-2 hover:opacity-80"
								>
									<ImagePlaceholder className="w-full aspect-square" />
									<span className="font-mono text-label uppercase tracking-[0.08em] text-gray-500">
										{obj.objectType}
									</span>
									<span className="font-mono text-meta font-medium text-gray-900 leading-snug group-hover:underline">
										{obj.title}
									</span>
									<span className="font-mono text-label text-gray-400">
										{obj.date}
									</span>
								</a>
							))}
						</div>
					</Container>
				</WireframeSection>
			</div>
			{roomZoomOpen && (
				<RoomZoomLightbox onClose={() => setRoomZoomOpen(false)} />
			)}
		</ScopePage>
	);
}

export default function InteriorPhotosPage() {
	return (
		<Suspense>
			<InteriorPhotosContent />
		</Suspense>
	);
}
