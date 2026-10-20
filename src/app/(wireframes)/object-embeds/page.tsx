"use client";

import { Suspense, useEffect, useState } from "react";
import {
	Container,
	ImagePlaceholder,
	usePageVariations,
} from "@/components/wireframe";
import NtsHeader from "@/components/wireframe/NtsHeader";
import { ScopePage } from "@/providers/ScopeProvider";

const VARIATIONS = [
	{ key: "components", label: "Components" },
	{ key: "in-situ", label: "In Situ" },
] as const;

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

function ObjectEmbed({
	size,
	obj = OBJECT,
	onZoom,
}: {
	size: Size;
	obj?: ObjectData;
	onZoom: () => void;
}) {
	if (size === "small") {
		return (
			<div className="flex max-w-md border border-gray-300">
				<ZoomableImage
					obj={obj}
					className="w-28 shrink-0 sm:w-32"
					onZoom={onZoom}
				/>
				<div className="p-3">
					<ObjectDetails obj={obj} compact />
				</div>
			</div>
		);
	}

	if (size === "large") {
		return (
			<div className="border border-gray-300">
				<ZoomableImage
					obj={obj}
					className="aspect-[16/9] w-full"
					onZoom={onZoom}
				/>
				<div className="p-4 sm:p-6">
					<ObjectDetails obj={obj} />
				</div>
			</div>
		);
	}

	// Medium matches the existing component, with zoom added
	return (
		<div className="flex flex-col border border-gray-300 sm:flex-row">
			<ZoomableImage
				obj={obj}
				className="aspect-[4/3] w-full shrink-0 sm:aspect-auto sm:w-1/4"
				onZoom={onZoom}
			/>
			<div className="p-4 sm:p-6">
				<ObjectDetails obj={obj} />
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

function ComponentsView({ onZoom }: { onZoom: (obj: ObjectData) => void }) {
	const openZoom = () => onZoom(OBJECT);

	return (
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
										onZoom={() => onZoom(obj)}
									/>
								))}
							</div>
						</section>
					</div>
				</Container>
			</div>
		</div>
	);
}

// ── In Situ: dummy NTS story page ───────────────────────────────────────

const STORY_OBJECTS: Record<string, ObjectData> = {
	writingCabinet: {
		title: "Writing Cabinet",
		dateCreated: "1904",
		objectNumber: "2.31.4",
	},
	bedroomChair: {
		title: "Ladder-back Chair",
		dateCreated: "1903",
		objectNumber: "2.14.3",
	},
	rosePanel: {
		title: "Stencilled Rose Panel",
		dateCreated: "1904",
		objectNumber: "3.02.7",
	},
};

const RELATED_STORIES = [
	{
		kicker: "Conservation",
		title: "Saving The Hill House: life inside the box",
	},
	{
		kicker: "People",
		title: "Margaret Macdonald and the Glasgow Style",
	},
	{
		kicker: "Places to visit",
		title: "A day out in Helensburgh",
	},
];

function StoryParagraph({ children }: { children: React.ReactNode }) {
	return <p className="font-mono text-body leading-[1.7]">{children}</p>;
}

function InSituView({ onZoom }: { onZoom: (obj: ObjectData) => void }) {
	const { writingCabinet, bedroomChair, rosePanel } = STORY_OBJECTS;

	return (
		<div className="min-h-screen bg-white text-gray-900">
			<NtsHeader
				breadcrumb={[
					{ label: "Home" },
					{ label: "Stories" },
					{ label: "Inside The Hill House" },
				]}
			/>

			<article>

				<div className="px-6 py-12">
					<Container size="sm">
						<p className="mb-4 font-mono text-label uppercase tracking-[0.08em] text-gray-500">
							Story · Charles Rennie Mackintosh
						</p>
						<h1 className="mb-4 font-mono text-display font-medium leading-[1.15] tracking-tight">
							Inside The Hill House: a home designed down to the last detail
						</h1>
						<p className="mb-12 font-mono text-meta text-gray-500 tabular-nums">
							14 October 2026 · 6 min read
						</p>

						<div className="space-y-6">
							<p className="font-mono text-section leading-[1.5] tracking-tight">
								When the publisher Walter Blackie commissioned a new family home
								in 1902, he gave Charles Rennie Mackintosh something rare: the
								freedom to design not just the building, but almost everything
								inside it.
							</p>
							<StoryParagraph>
								From the light fittings to the bedroom chairs, Mackintosh and
								his wife Margaret Macdonald shaped every room as part of a
								single idea. More than a century later, many of those pieces are
								still in the house, and you can explore them in our collection.
							</StoryParagraph>
						</div>

						{/* Large embed: full content width */}
						<div className="my-16">
							<ObjectEmbed
								size="large"
								obj={OBJECT}
								onZoom={() => onZoom(OBJECT)}
							/>
						</div>

						<h2 className="mt-20 mb-6 font-mono text-section font-medium tracking-tight">
							Light and shadow in the drawing room
						</h2>
						<div className="space-y-6">
							<StoryParagraph>
								The drawing room was designed around the changing light of the
								day. A deep window bay catches the morning sun, while the
								evening was lit by lamps like the standard lamp above, its
								mother-of-pearl inlays glinting in the dark.
							</StoryParagraph>
							<StoryParagraph>
								Mackintosh used stencilled roses on the walls to tie the room
								together, a motif that appears again and again throughout the
								house.
							</StoryParagraph>
						</div>

						{/* Small embed: inline in the flow of text */}
						<div className="my-10">
							<ObjectEmbed
								size="small"
								obj={rosePanel}
								onZoom={() => onZoom(rosePanel)}
							/>
						</div>

						<StoryParagraph>
							Visitors often notice how the roses soften the strong verticals of
							the furniture, a balance of hard and soft that defines the Glasgow
							Style.
						</StoryParagraph>

						<h2 className="mt-20 mb-6 font-mono text-section font-medium tracking-tight">
							A cabinet made for one room
						</h2>
						<StoryParagraph>
							Some of Mackintosh&apos;s most celebrated pieces were designed for
							a specific spot in the house. The writing cabinet was made for the
							drawing room, and its proportions only fully make sense when you
							see it in place.
						</StoryParagraph>

						{/* Medium embed: the existing component */}
						<div className="my-10">
							<ObjectEmbed
								size="medium"
								obj={writingCabinet}
								onZoom={() => onZoom(writingCabinet)}
							/>
						</div>

						<blockquote className="my-16 border-l-2 border-gray-400 pl-6">
							<p className="mb-3 font-mono text-section leading-[1.5] tracking-tight">
								&ldquo;Here is the house. It is not an Italian villa, an English
								mansion, a Swiss chalet or a Scotch castle. It is a dwelling
								house.&rdquo;
							</p>
							<footer className="font-mono text-meta text-gray-500">
								Charles Rennie Mackintosh, on handing over The Hill House
							</footer>
						</blockquote>

						<h2 className="mt-20 mb-6 font-mono text-section font-medium tracking-tight">
							Upstairs: the white bedroom
						</h2>
						<StoryParagraph>
							The main bedroom is the most complete Mackintosh interior to
							survive. Its tall ladder-back chairs were never really meant for
							sitting on. They were there to frame the room, standing like dark
							silhouettes against the white walls.
						</StoryParagraph>
					</Container>
				</div>

				{/* Card row: wider than the text column */}
				<div className="px-6 pb-16">
					<Container size="md">
						<p className="mb-6 font-mono text-label uppercase tracking-[0.08em] text-gray-500">
							Objects in this story
						</p>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{[OBJECT, writingCabinet, bedroomChair].map((obj) => (
								<ObjectCard
									key={obj.objectNumber}
									obj={obj}
									onZoom={() => onZoom(obj)}
								/>
							))}
						</div>
						<p className="mt-6 font-mono text-meta">
							<a href="/crm-search" className="underline">
								Explore the Mackintosh collection
							</a>
						</p>
					</Container>
				</div>

				<div className="border-t border-gray-200 px-6 py-16">
					<Container size="md">
						<h2 className="mb-6 font-mono text-section font-medium tracking-tight">
							Related stories
						</h2>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
							{RELATED_STORIES.map((story) => (
								<a
									key={story.title}
									href="#related"
									className="block border border-gray-300 hover:border-gray-500 hover:bg-gray-50"
								>
									<ImagePlaceholder className="aspect-[4/3] w-full" />
									<div className="p-4">
										<p className="mb-2 font-mono text-label uppercase tracking-[0.08em] text-gray-500">
											{story.kicker}
										</p>
										<p className="font-mono text-card font-medium leading-snug tracking-tight">
											{story.title}
										</p>
									</div>
								</a>
							))}
						</div>
					</Container>
				</div>
			</article>

		</div>
	);
}

function ObjectEmbedsContent() {
	const variation = usePageVariations(VARIATIONS);
	const [zoomObject, setZoomObject] = useState<ObjectData | null>(null);

	return (
		<ScopePage id="object-embeds">
			{variation === "in-situ" ? (
				<InSituView onZoom={setZoomObject} />
			) : (
				<ComponentsView onZoom={setZoomObject} />
			)}

			{zoomObject && (
				<ZoomLightbox obj={zoomObject} onClose={() => setZoomObject(null)} />
			)}
		</ScopePage>
	);
}

export default function ObjectEmbedsPage() {
	return (
		<Suspense>
			<ObjectEmbedsContent />
		</Suspense>
	);
}
