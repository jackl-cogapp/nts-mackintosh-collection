"use client";

import { Suspense, useState } from "react";
import {
	Container,
	ImagePlaceholder,
	WireframeSection,
	usePageVariations,
} from "@/components/wireframe";
import NtsFooter from "@/components/wireframe/NtsFooter";
import NtsHeader from "@/components/wireframe/NtsHeader";
import { ScopePage } from "@/providers/ScopeProvider";
import CrmItemPostMvp from "./CrmItemPostMvp";

const VARIATIONS = [
	{ key: "burns-style", label: "MVP" },
	{ key: "post-mvp", label: "Post-MVP" },
	{ key: "tombstone", label: "Tombstone" },
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
	category: "",
	materials: ["Sycamore", "Mother of Pearl"],
	dimensions: { height: "140 cm", width: null, depth: null },
	themes: [],
	thumbnails: 3,
};

// ── Helpers ─────────────────────────────────────────────────────────────

// ── Sub-components ──────────────────────────────────────────────────────

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="border-b border-gray-100 py-2.5">
			<p className="font-mono text-label uppercase tracking-[0.08em] text-gray-500 mb-0.5">{label}</p>
			<div className="font-mono text-meta text-gray-800">{children}</div>
		</div>
	);
}

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

function ObjectInfoField({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div>
			<p className="font-mono text-body font-semibold text-gray-900 mb-1">{label}</p>
			<div className="font-mono text-body text-gray-700">{children}</div>
		</div>
	);
}

function ObjectInfoFields() {
	return (
		<div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-prose">
			<ObjectInfoField label="Category">
				{ITEM.category
					? <a href="#" className="underline text-gray-700 hover:text-black">{ITEM.category}</a>
					: <Dash />}
			</ObjectInfoField>
			<ObjectInfoField label="Material/s">
				{ITEM.materials.length > 0 ? ITEM.materials.map((m, i) => (
					<span key={i}>
						<a href="#" className="underline text-gray-700 hover:text-black">{m}</a>
						{i < ITEM.materials.length - 1 ? ", " : ""}
					</span>
				)) : <Dash />}
			</ObjectInfoField>
			<ObjectInfoField label="Measurements">
				<Measurements />
			</ObjectInfoField>
			<ObjectInfoField label="Themes">
				{ITEM.themes.length > 0 ? ITEM.themes.map((th, i) => (
					<span key={i}>
						<a href="#" className="underline text-gray-700 hover:text-black">{th}</a>
						{i < ITEM.themes.length - 1 ? ", " : ""}
					</span>
				)) : <Dash />}
			</ObjectInfoField>
		</div>
	);
}

function KeyDetailsTombstone() {
	return (
		<div className="border-2 border-gray-300 p-4">
			<DetailRow label="Object number">{ITEM.objectNumber}</DetailRow>
			<DetailRow label="Date">{ITEM.date}</DetailRow>
			<DetailRow label="Period">{ITEM.period}</DetailRow>
			<DetailRow label="On display">
				{ITEM.onDisplay ? "Yes" : "No"}
			</DetailRow>
			<DetailRow label="Creator/s">
				{ITEM.creators.map((c, i) => (
					<span key={i}>
						<a href="#" className="underline text-gray-700 hover:text-black">{c.name}</a> ({c.role})
						{i < ITEM.creators.length - 1 ? ", " : ""}
					</span>
				))}
			</DetailRow>
		</div>
	);
}

function ObjectInfoTombstone() {
	return (
		<div className="border border-gray-200 p-4">
			<p className="font-mono text-label uppercase tracking-[0.08em] text-gray-400 mb-3 pb-2 border-b border-gray-100">Object information</p>
			<DetailRow label="Material/s">
				{ITEM.materials.length > 0 ? ITEM.materials.map((m, i) => (
					<span key={i}>
						<a href="#" className="underline text-gray-700 hover:text-black">{m}</a>
						{i < ITEM.materials.length - 1 ? ", " : ""}
					</span>
				)) : <Dash />}
			</DetailRow>
			<DetailRow label="Measurements">
				<Measurements />
			</DetailRow>
			<DetailRow label="Acquisition">
				{ITEM.acquisition || <Dash />}
			</DetailRow>
			<DetailRow label="Category">
				{ITEM.category
					? <a href="#" className="underline text-gray-700 hover:text-black">{ITEM.category}</a>
					: <Dash />}
			</DetailRow>
			<DetailRow label="Themes">
				{ITEM.themes.length > 0 ? ITEM.themes.map((th, i) => (
					<span key={i}>
						<a href="#" className="underline text-gray-700 hover:text-black">{th}</a>
						{i < ITEM.themes.length - 1 ? ", " : ""}
					</span>
				)) : <Dash />}
			</DetailRow>
		</div>
	);
}

function ImageWithControls({ label }: { label: string }) {
	return (
		<div className="relative">
			<ImagePlaceholder className="w-full aspect-[4/3]" label={label} />
			<div className="absolute top-2 right-2 flex flex-col gap-1">
				{[
					{ key: "fullscreen", title: "Full screen", glyph: "⤢" },
					{ key: "zoom-in",    title: "Zoom in",    glyph: "+" },
					{ key: "zoom-out",   title: "Zoom out",   glyph: "−" },
				].map(({ key, title, glyph }) => (
					<button
						key={key}
						type="button"
						aria-label={title}
						title={title}
						className="w-7 h-7 bg-white/80 border border-gray-300 font-mono text-meta text-gray-600 hover:bg-white hover:border-gray-500 flex items-center justify-center leading-none"
					>
						{glyph}
					</button>
				))}
			</div>
		</div>
	);
}

// ── Page ────────────────────────────────────────────────────────────────

function CRMItemCurrent({ variation }: { variation: string }) {
	const [showMore, setShowMore] = useState(false);
	const [activeThumb, setActiveThumb] = useState(0);

	const relatedByCreator = [
		{ title: "Pinks", date: "1915", objectType: "Watercolour" },
		{ title: "Hill House, Ground Floor Plan", date: "1902", objectType: "Architectural Drawing" },
		{ title: "Ladder-back Chair", date: "1903", objectType: "Furniture" },
		{ title: "Glasgow School of Art, North Elevation", date: "1897", objectType: "Architectural Drawing" },
	];

	const relatedObjects = [
		{ title: "Writing Cabinet", date: "1904", objectType: "Furniture" },
		{ title: "Silver Candlestick", date: "1896", objectType: "Metalwork" },
		{ title: "Embroidered Panel with Rose Motif", date: "1902", objectType: "Textile" },
		{ title: "Door Handle Plate, Hill House", date: "1903", objectType: "Metalwork" },
	];

	return (
		<ScopePage id="crm-item">
			<div className="min-h-screen bg-white">
				<NtsHeader
					breadcrumb={[
						{ label: "Home" },
						{ label: "Collections" },
						{ label: "Charles Rennie Mackintosh" },
						{ label: "Search", href: "/crm-search" },
						{ label: ITEM.objectName },
					]}
				/>

				<div className="border-b border-gray-200 px-6 pt-8 pb-0 text-center">
					<Container size="lg">
						<h1 className="font-mono text-display font-medium tracking-tight text-gray-900 mb-8">
							{ITEM.objectName}
						</h1>
					</Container>
				</div>

				{variation === "tombstone" ? (
					/* ── Tombstone variation ── */
					<WireframeSection label="Image viewer" className="border-b border-gray-200 px-6 py-10">
						<Container size="lg">
							<div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_260px]">
								{/* Left: image + thumbnails + description + share */}
								<div className="flex flex-col gap-6">
									<div>
										<ImageWithControls label={`[Image ${activeThumb + 1} of ${ITEM.thumbnails}]`} />
										<div className="flex flex-wrap items-center justify-center gap-3 mt-4">
											<button type="button" className="border border-gray-300 px-3 py-1.5 font-mono text-meta hover:bg-gray-100 disabled:opacity-30" disabled={activeThumb === 0} onClick={() => setActiveThumb(t => t - 1)}>←</button>
											{Array.from({ length: ITEM.thumbnails }, (_, i) => (
												<button key={i} type="button" onClick={() => setActiveThumb(i)} className={`w-16 h-16 border-2 ${activeThumb === i ? "border-gray-800" : "border-gray-300 hover:border-gray-500"}`}>
													<ImagePlaceholder className="w-full h-full" />
												</button>
											))}
											<button type="button" className="border border-gray-300 px-3 py-1.5 font-mono text-meta hover:bg-gray-100 disabled:opacity-30" disabled={activeThumb === ITEM.thumbnails - 1} onClick={() => setActiveThumb(t => t + 1)}>→</button>
										</div>
										<p className="text-center font-mono text-label text-gray-400 mt-2">Image {activeThumb + 1} of {ITEM.thumbnails}</p>
									</div>

									<WireframeSection label="Description">
										<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-4">Description</h2>
										<div className="space-y-4">
											{ITEM.description.map((para, i) => (
												<p key={i} className="font-mono text-body text-gray-700 leading-[1.7]">{para}</p>
											))}
											{showMore && ITEM.showMoreDescription && (
												<p className="font-mono text-body text-gray-700 leading-[1.7]">{ITEM.showMoreDescription}</p>
											)}
										</div>
										{ITEM.showMoreDescription && (
											<button type="button" onClick={() => setShowMore(s => !s)} className="mt-3 font-mono text-meta text-gray-600 underline hover:text-black flex items-center gap-1">
												{showMore ? "▲ Show less" : "▼ Show more"}
											</button>
										)}
									</WireframeSection>
								</div>

								{/* Right: two tombstones stacked */}
								<div className="flex flex-col gap-6">
									<WireframeSection label="Key details" className="border-2 border-red-500 p-4">
										<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-4">Key details</h2>
										<KeyDetailsTombstone />
									</WireframeSection>
									<WireframeSection label="Object information" className="border-2 border-red-500 p-4">
										<ObjectInfoTombstone />
									</WireframeSection>
								</div>
							</div>
						</Container>
					</WireframeSection>
				) : (
					<>
						{/* ── Burns style: image viewer full-width, then 2-col below ── */}
						<WireframeSection label="Image viewer" className="border-b border-gray-200 bg-gray-50 px-6 py-8">
							<Container size="lg">
								<div className="relative">
									<ImagePlaceholder className="w-full aspect-[4/3] max-h-[500px]" label={`[Image ${activeThumb + 1} of ${ITEM.thumbnails}]`} />
									<div className="absolute top-2 left-2 flex flex-col gap-0.5 sm:gap-1">
										{["[ ]", "[+]", "[-]", "[~]", "[|]", "[↓]", "[🔒]"].map((ctrl, i) => (
											<button key={i} type="button" className="flex h-6 w-6 items-center justify-center border border-gray-300 bg-white/80 font-mono text-label text-gray-500 hover:border-gray-500 hover:bg-white sm:h-7 sm:w-7">
												{ctrl}
											</button>
										))}
									</div>
									<div className="flex flex-wrap items-center justify-center gap-3 mt-4">
										<button type="button" className="border border-gray-300 px-3 py-1.5 font-mono text-meta hover:bg-gray-100 disabled:opacity-30" disabled={activeThumb === 0} onClick={() => setActiveThumb(t => t - 1)}>←</button>
										{Array.from({ length: ITEM.thumbnails }, (_, i) => (
											<button key={i} type="button" onClick={() => setActiveThumb(i)} className={`w-16 h-16 border-2 ${activeThumb === i ? "border-gray-800" : "border-gray-300 hover:border-gray-500"}`}>
												<ImagePlaceholder className="w-full h-full" />
											</button>
										))}
										<button type="button" className="border border-gray-300 px-3 py-1.5 font-mono text-meta hover:bg-gray-100 disabled:opacity-30" disabled={activeThumb === ITEM.thumbnails - 1} onClick={() => setActiveThumb(t => t + 1)}>→</button>
									</div>
									<p className="text-center font-mono text-label text-gray-400 mt-2">Image {activeThumb + 1} of {ITEM.thumbnails}</p>
								</div>
							</Container>
						</WireframeSection>

						<div className="border-b border-gray-200 px-6 py-10">
							<Container size="lg">
								<div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
									<WireframeSection label="Key details" className="order-first w-full border-2 border-red-500 p-4 lg:order-last lg:w-56 lg:shrink-0">
										<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-4">Key details</h2>
										<KeyDetailsTombstone />
									</WireframeSection>
									<div className="min-w-0 flex-1">
										<WireframeSection label="Description">
											<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-4">Description</h2>
											<div className="space-y-4 max-w-prose">
												{ITEM.description.map((para, i) => (
													<p key={i} className="font-mono text-body text-gray-700 leading-[1.7]">{para}</p>
												))}
												{showMore && ITEM.showMoreDescription && (
													<p className="font-mono text-body text-gray-700 leading-[1.7]">{ITEM.showMoreDescription}</p>
												)}
											</div>
											{ITEM.showMoreDescription && (
												<button type="button" onClick={() => setShowMore(s => !s)} className="mt-4 font-mono text-meta text-gray-600 underline hover:text-black flex items-center gap-1">
													{showMore ? "▲ Show less" : "▼ Show more"}
												</button>
											)}
										</WireframeSection>

										<WireframeSection label="Object information" className="mt-10 border-2 border-red-500 p-4">
											<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-6">Object information</h2>
											<ObjectInfoFields />
										</WireframeSection>
									</div>
								</div>
							</Container>
						</div>
					</>
				)}

				{/* More by this creator */}
				<WireframeSection label="More by this creator" className="border-b border-gray-200 px-6 py-10">
					<Container size="lg">
						<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-6">You might also like</h2>
						<div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
							{relatedByCreator.map((obj, i) => (
								<a key={i} href="#" className="group flex flex-col gap-2 hover:opacity-80">
									<ImagePlaceholder className="w-full aspect-square" />
									<span className="font-mono text-label uppercase tracking-[0.08em] text-gray-500">{obj.objectType}</span>
									<span className="font-mono text-meta font-medium text-gray-900 leading-snug group-hover:underline">{obj.title}</span>
									<span className="font-mono text-label text-gray-400">{obj.date}</span>
								</a>
							))}
						</div>
					</Container>
				</WireframeSection>

				{/* Related content */}
				<WireframeSection label="Related content" className="border-t border-b border-gray-200 px-6 py-10">
					<Container size="lg">
						<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-6">Related content</h2>
						<div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
							{relatedObjects.map((obj, i) => (
								<a key={i} href="#" className="group flex flex-col gap-2 hover:opacity-80">
									<ImagePlaceholder className="w-full aspect-square" />
									<span className="font-mono text-label uppercase tracking-[0.08em] text-gray-500">{obj.objectType}</span>
									<span className="font-mono text-meta font-medium text-gray-900 leading-snug group-hover:underline">{obj.title}</span>
									<span className="font-mono text-label text-gray-400">{obj.date}</span>
								</a>
							))}
						</div>
					</Container>
				</WireframeSection>

				{/* Caring for Collections CTA */}
				<WireframeSection label="Caring for collections CTA" className="bg-gray-700 px-6 py-32 text-center text-white">
					<h2 className="font-mono text-page font-medium uppercase tracking-tight text-white">Caring for Collections</h2>
					<button type="button" className="mt-8 border border-white px-6 py-3 font-mono text-meta font-medium uppercase tracking-[0.08em] text-white hover:bg-white hover:text-gray-900">
						Donate today →
					</button>
				</WireframeSection>

				<div style={{ height: "64px" }} />

				<NtsFooter />
			</div>
		</ScopePage>
	);
}

// Post-MVP is a separate copy so it can diverge without touching MVP / Tombstone
function CRMItemContent() {
	const variation = usePageVariations(VARIATIONS);
	return variation === "post-mvp" ? <CrmItemPostMvp /> : <CRMItemCurrent variation={variation} />;
}

export default function CRMItemPage() {
	return (
		<Suspense>
			<CRMItemContent />
		</Suspense>
	);
}
