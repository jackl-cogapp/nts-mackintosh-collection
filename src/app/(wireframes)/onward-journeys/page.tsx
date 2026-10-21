"use client";

import { type ReactNode, Suspense, useState } from "react";
import {
	Container,
	ImagePlaceholder,
	WireframeSection,
	usePageVariations,
} from "@/components/wireframe";
import NtsFooter from "@/components/wireframe/NtsFooter";
import NtsHeader from "@/components/wireframe/NtsHeader";
import { ScopePage } from "@/providers/ScopeProvider";

const VARIATIONS = [
	{ key: "object-page", label: "Object Page" },
	{ key: "metadata", label: "Metadata" },
] as const;

// Onward journeys by metadata (NTS11-44): each card leads to another object
// that shares one metadata value with this one
const METADATA_JOURNEYS = [
	{
		field: "Material",
		value: "Mother of Pearl",
		title: "Writing Cabinet",
	},
	{
		field: "Maker",
		value: "John Craig",
		title: "Ladder-back Chair",
	},
	{
		field: "Theme",
		value: "Lighting",
		title: "Hall Lantern",
	},
	{
		field: "Associated person",
		value: "Walter Blackie",
		title: "Hill House, Ground Floor Plan",
	},
];

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
	provenance: "Commissioned by Walter Blackie for The Hill House, Helensburgh; remained in the house until it passed to the National Trust for Scotland.",
	acquisitionDate: "1982",
	isArchive: false,
	thumbnails: 3,
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

function ObjectInfoField({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div>
			<p className="font-mono text-body font-semibold text-gray-900 mb-1">{label}</p>
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
	) : <Dash />;
}

function FieldLink({ children }: { children: ReactNode }) {
	return <a href="#" className="underline text-gray-700 hover:text-black">{children}</a>;
}

// MVP object information: four headline fields, the rest behind "More details"
function ObjectInfoFields() {
	const [expanded, setExpanded] = useState(false);
	return (
		<div className="max-w-prose">
			<div className="grid grid-cols-2 gap-x-8 gap-y-6">
				<ObjectInfoField label="Date">{ITEM.date}</ObjectInfoField>
				<ObjectInfoField label="Maker/Creator">
					<LinkList items={ITEM.creators.map((c) => <><FieldLink>{c.name}</FieldLink> ({c.role})</>)} />
				</ObjectInfoField>
				<ObjectInfoField label="Materials">
					<LinkList items={ITEM.materials.map((m) => <FieldLink>{m}</FieldLink>)} />
				</ObjectInfoField>
				<ObjectInfoField label="Measurements">
					<Measurements />
				</ObjectInfoField>
			</div>

			{expanded && (
				<div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-gray-200 pt-6">
					<ObjectInfoField label="On display">{ITEM.onDisplay ? "Yes" : "No"}</ObjectInfoField>
					<ObjectInfoField label="Category">
						{ITEM.category ? <FieldLink>{ITEM.category}</FieldLink> : <Dash />}
					</ObjectInfoField>
					<ObjectInfoField label="Themes">
						<LinkList items={ITEM.themes.map((th) => <FieldLink>{th}</FieldLink>)} />
					</ObjectInfoField>
					<ObjectInfoField label="Associated person">
						<LinkList items={ITEM.associatedPeople.map((ap) => <FieldLink>{ap}</FieldLink>)} />
					</ObjectInfoField>
					<div className="col-span-2">
						<ObjectInfoField label="Provenance">{ITEM.provenance || <Dash />}</ObjectInfoField>
					</div>
					<ObjectInfoField label="Acquisition date">{ITEM.acquisitionDate || <Dash />}</ObjectInfoField>
					<ObjectInfoField label={ITEM.isArchive ? "Archive number" : "Object number"}>{ITEM.objectNumber}</ObjectInfoField>
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

// ── Page ────────────────────────────────────────────────────────────────

// Onward Journeys: started as a copy of the Object Page
function OnwardJourneysContent() {
	const variation = usePageVariations(VARIATIONS);
	const [showMore, setShowMore] = useState(false);
	const [activeThumb, setActiveThumb] = useState(0);

	const relatedByCreator = [
		{ title: "Pinks", date: "1915", objectType: "Watercolour" },
		{ title: "Hill House, Ground Floor Plan", date: "1902", objectType: "Architectural Drawing" },
		{ title: "Ladder-back Chair", date: "1903", objectType: "Furniture" },
		{ title: "Glasgow School of Art, North Elevation", date: "1897", objectType: "Architectural Drawing" },
	];


	return (
		<ScopePage id="onward-journeys">
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
								<WireframeSection label="Key details" className="order-first w-full lg:order-last lg:w-56 lg:shrink-0">
									<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-4">Key details</h2>
									{/* Fields to be decided */}
									<div className="flex items-center justify-center border-2 border-gray-300 py-16">
										<p className="font-mono text-page font-semibold tracking-tight text-gray-400">TBD</p>
									</div>
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

									<WireframeSection label="Object information" className="mt-10">
										<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-6">Object information</h2>
										<ObjectInfoFields />
									</WireframeSection>
								</div>
							</div>
						</Container>
					</div>

				{/* More by this creator (Object Page tab only) */}
				{variation !== "metadata" && (
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
				)}

				{/* Onward journeys by metadata (Metadata tab) */}
				{variation === "metadata" && (
					<WireframeSection
						label="Onward journeys"
						className="border-b border-gray-200 px-6 py-10"
					>
						<Container size="lg">
							<h2 className="font-mono text-section font-medium tracking-tight text-gray-900 mb-6">
								Explore objects like this
							</h2>
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
								{METADATA_JOURNEYS.map((j) => (
									<a
										key={j.field}
										href="#"
										className="group flex flex-col border border-gray-300 hover:border-gray-500 hover:bg-gray-50"
									>
										<ImagePlaceholder className="w-full" aspect="1/1" />
										<span className="flex flex-col gap-1 p-4">
											<span className="font-mono text-label uppercase tracking-[0.08em] text-gray-500">
												{j.field}: {j.value}
											</span>
											<span className="font-mono text-card font-medium leading-snug tracking-tight text-gray-900 group-hover:underline">
												{j.title}
											</span>
										</span>
									</a>
								))}
							</div>
						</Container>
					</WireframeSection>
				)}

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

export default function OnwardJourneysPage() {
	return (
		<Suspense>
			<OnwardJourneysContent />
		</Suspense>
	);
}
