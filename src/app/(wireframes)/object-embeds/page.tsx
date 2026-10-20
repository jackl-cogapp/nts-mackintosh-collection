"use client";

import { useEffect, useState } from "react";
import { Container, ImagePlaceholder } from "@/components/wireframe";
import { ScopePage } from "@/providers/ScopeProvider";

// ── Mock objects ────────────────────────────────────────────────────────

interface ObjectData {
	title: string;
	dateCreated: string;
	objectNumber: string;
}

const OBJECT: ObjectData = {
	title: "Standard Lamp",
	dateCreated: "1905",
	objectNumber: "2.27.1",
};

const ROW_OBJECTS: ObjectData[] = [
	OBJECT,
	{ title: "Ladder-back Chair", dateCreated: "1903", objectNumber: "2.14.3" },
	{
		title: "Leaded Glass Door Panel",
		dateCreated: "1903",
		objectNumber: "1.09.2",
	},
];

type Size = "small" | "medium" | "large";

// ── Zoom lightbox ───────────────────────────────────────────────────────

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;

function ZoomLightbox({
	obj,
	onClose,
}: {
	obj: ObjectData;
	onClose: () => void;
}) {
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
			aria-label={`${obj.title}, zoomable image`}
			className="fixed inset-0 z-[100] flex flex-col bg-gray-900/95"
		>
			<div className="flex items-center justify-between gap-4 px-4 py-3">
				<p className="font-mono text-meta text-white">{obj.title}</p>
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
					className="w-full max-w-3xl origin-center"
					style={{ transform: `scale(${zoom})` }}
				>
					<ImagePlaceholder
						className="w-full"
						label="[Zoomable image, pan and pinch to zoom]"
					/>
				</div>
			</div>
		</div>
	);
}

function LightboxButton({
	label,
	disabled,
	onClick,
	children,
}: {
	label: string;
	disabled?: boolean;
	onClick: () => void;
	children: React.ReactNode;
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

// ── Embeddable object component ─────────────────────────────────────────

function ZoomableImage({
	obj,
	className,
	onZoom,
}: {
	obj: ObjectData;
	className: string;
	onZoom: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onZoom}
			aria-label={`Zoom image of ${obj.title}`}
			className={`group relative block ${className}`}
		>
			<ImagePlaceholder className="h-full w-full" />
			<span className="absolute right-2 bottom-2 border border-gray-400 bg-white px-1.5 py-0.5 font-mono text-label text-gray-700 group-hover:border-gray-800">
				⤢ Zoom
			</span>
		</button>
	);
}

function ObjectDetails({
	obj = OBJECT,
	compact = false,
}: {
	obj?: ObjectData;
	compact?: boolean;
}) {
	return (
		<div className="flex min-w-0 flex-col justify-center gap-2">
			<p className="font-mono text-label uppercase tracking-[0.08em] text-gray-500">
				Collection Object
			</p>
			<a
				href="/crm-item"
				className={`font-mono font-medium leading-snug tracking-tight text-gray-900 underline hover:text-black ${
					compact ? "text-meta" : "text-card"
				}`}
			>
				{obj.title}
			</a>
			{!compact && (
				<p className="font-mono text-meta text-gray-500 tabular-nums">
					Date created: {obj.dateCreated}
				</p>
			)}
			<p className="font-mono text-label uppercase tracking-[0.08em] text-gray-500 tabular-nums">
				Object number: {obj.objectNumber}
			</p>
		</div>
	);
}

function ObjectEmbed({ size, onZoom }: { size: Size; onZoom: () => void }) {
	if (size === "small") {
		return (
			<div className="flex max-w-md border border-gray-300">
				<ZoomableImage
					obj={OBJECT}
					className="w-28 shrink-0 sm:w-32"
					onZoom={onZoom}
				/>
				<div className="p-3">
					<ObjectDetails compact />
				</div>
			</div>
		);
	}

	if (size === "large") {
		return (
			<div className="border border-gray-300">
				<ZoomableImage
					obj={OBJECT}
					className="aspect-[16/9] w-full"
					onZoom={onZoom}
				/>
				<div className="p-4 sm:p-6">
					<ObjectDetails />
				</div>
			</div>
		);
	}

	// Medium matches the existing component, with zoom added
	return (
		<div className="flex flex-col border border-gray-300 sm:flex-row">
			<ZoomableImage
				obj={OBJECT}
				className="aspect-[4/3] w-full shrink-0 sm:aspect-auto sm:w-1/4"
				onZoom={onZoom}
			/>
			<div className="p-4 sm:p-6">
				<ObjectDetails />
			</div>
		</div>
	);
}

// Stacked card: image on top, text below, sized to sit in a row
function ObjectCard({ obj, onZoom }: { obj: ObjectData; onZoom: () => void }) {
	return (
		<div className="flex flex-col border border-gray-300">
			<ZoomableImage
				obj={obj}
				className="aspect-square w-full"
				onZoom={onZoom}
			/>
			<div className="p-4">
				<ObjectDetails obj={obj} />
			</div>
		</div>
	);
}

// ── Page ────────────────────────────────────────────────────────────────

const SIZES: { key: Size; label: string; note: string }[] = [
	{
		key: "small",
		label: "Small",
		note: "Compact thumbnail and title, for lists or tight spaces",
	},
	{
		key: "medium",
		label: "Medium",
		note: "Same layout as the existing component",
	},
	{
		key: "large",
		label: "Large",
		note: "Full content width image with details below",
	},
];

export default function ObjectEmbedsPage() {
	const [zoomObject, setZoomObject] = useState<ObjectData | null>(null);
	const openZoom = () => setZoomObject(OBJECT);

	return (
		<ScopePage id="object-embeds">
			<div className="min-h-screen bg-white">
				<div className="px-6 py-10">
					<Container size="md">
						<h1 className="mb-12 font-mono text-display font-medium leading-[1.15] tracking-tight text-gray-900">
							Embeddable Object Components
						</h1>

						<div className="space-y-20">
							{SIZES.map((s) => (
								<section key={s.key}>
									<p className="mb-1 font-mono text-label uppercase tracking-[0.08em] text-gray-500">
										Size: {s.label}
									</p>
									<p className="mb-6 font-mono text-meta text-gray-500">
										{s.note}
									</p>
									<h2 className="mb-6 font-mono text-section font-medium tracking-tight text-gray-900">
										1. {OBJECT.title}
									</h2>
									<div>
										<ObjectEmbed size={s.key} onZoom={openZoom} />
									</div>
								</section>
							))}

							<section>
								<p className="mb-1 font-mono text-label uppercase tracking-[0.08em] text-gray-500">
									Size: Card
								</p>
								<p className="mb-6 font-mono text-meta text-gray-500">
									Image on top, text below, stacks in a row
								</p>
								<h2 className="mb-6 font-mono text-section font-medium tracking-tight text-gray-900">
									2. Furniture and fittings
								</h2>
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
									{ROW_OBJECTS.map((obj) => (
										<ObjectCard
											key={obj.objectNumber}
											obj={obj}
											onZoom={() => setZoomObject(obj)}
										/>
									))}
								</div>
							</section>
						</div>
					</Container>
				</div>
			</div>

			{zoomObject && (
				<ZoomLightbox obj={zoomObject} onClose={() => setZoomObject(null)} />
			)}
		</ScopePage>
	);
}
