"use client";

import { Suspense, useRef, useState } from "react";
import {
	Container,
	SectionLabel,
	WireframeSection,
} from "@/components/wireframe";
import NtsFooter from "@/components/wireframe/NtsFooter";
import NtsHeader from "@/components/wireframe/NtsHeader";
import { ScopePage } from "@/providers/ScopeProvider";

type Region = "scotland" | "europe";

interface LocationArtwork {
	title: string;
	meta: string;
}

interface Location {
	label: string;
	top: string;
	left: string;
	info: string;
	artworks: LocationArtwork[];
}

const LOCATIONS: Record<Region, Location[]> = {
	scotland: [
		{
			label: "Glasgow School of Art", top: "32%", left: "44%", info: "1897–1909",
			artworks: [
				{ title: "GSA Library Interior", meta: "Architecture drawing, 1909" },
				{ title: "GSA East Wing Facade", meta: "Photograph, 1897" },
				{ title: "Wrought Iron Brackets", meta: "Decorative detail, 1897" },
			],
		},
		{
			label: "Hill House, Helensburgh", top: "18%", left: "12%", info: "1902–1904",
			artworks: [
				{ title: "Hill House Exterior", meta: "Photograph, 1904" },
				{ title: "The Master Bedroom", meta: "Interior design, 1903" },
				{ title: "Ladder-Back Chair", meta: "Furniture, 1902" },
			],
		},
		{
			label: "Willow Tea Rooms, Glasgow", top: "55%", left: "25%", info: "1903",
			artworks: [
				{ title: "Room de Luxe", meta: "Interior, 1903" },
				{ title: "Leaded Glass Door Panel", meta: "Glasswork, 1903" },
				{ title: "High-Back Chair", meta: "Furniture, 1903" },
			],
		},
		{
			label: "House for an Art Lover", top: "72%", left: "15%", info: "1901 design",
			artworks: [
				{ title: "Music Room Design", meta: "Drawing, 1901" },
				{ title: "Exterior Elevation", meta: "Architectural drawing, 1901" },
				{ title: "Rose Motif Panel", meta: "Design, 1901" },
			],
		},
		{
			label: "Scotland Street School", top: "75%", left: "60%", info: "1903–1906",
			artworks: [
				{ title: "School Staircase Tower", meta: "Architecture, 1906" },
				{ title: "Entrance Vestibule", meta: "Interior detail, 1906" },
				{ title: "Glazed Tile Panel", meta: "Decorative detail, 1906" },
			],
		},
		{
			label: "The Lighthouse, Glasgow", top: "45%", left: "72%", info: "1895",
			artworks: [
				{ title: "Glasgow Herald Building", meta: "Architecture, 1895" },
				{ title: "Tower Staircase", meta: "Photograph, 1895" },
				{ title: "Corner Turret Detail", meta: "Architectural detail, 1895" },
			],
		},
	],
	europe: [
		{
			label: "Vienna — Secessionist Exhibition", top: "48%", left: "58%", info: "1900",
			artworks: [
				{ title: "Vienna Exhibition Room", meta: "Installation, 1900" },
				{ title: "Settle and Chair Display", meta: "Furniture, 1900" },
				{ title: "Exhibition Catalogue", meta: "Print, 1900" },
			],
		},
		{
			label: "Turin — International Exhibition", top: "55%", left: "50%", info: "1902",
			artworks: [
				{ title: "Rose Boudoir", meta: "Interior design, 1902" },
				{ title: "Writing Cabinet", meta: "Furniture, 1902" },
				{ title: "Turin Exhibition Poster", meta: "Print, 1902" },
			],
		},
		{
			label: "Port Vendres, France", top: "62%", left: "40%", info: "1923–1927",
			artworks: [
				{ title: "Port Vendres", meta: "Watercolour, 1924" },
				{ title: "La Rue du Soleil", meta: "Watercolour, 1926" },
				{ title: "The Rock", meta: "Watercolour, 1927" },
			],
		},
		{
			label: "Budapest", top: "46%", left: "62%", info: "1900",
			artworks: [
				{ title: "Budapest Exhibition Display", meta: "Installation, 1900" },
				{ title: "Silver Candelabra", meta: "Metalwork, 1900" },
			],
		},
		{
			label: "Dresden", top: "38%", left: "56%", info: "1901",
			artworks: [
				{ title: "Dresden Exhibition Room", meta: "Installation, 1901" },
				{ title: "Oval Table", meta: "Furniture, 1901" },
				{ title: "Writing Desk", meta: "Furniture, 1901" },
			],
		},
	],
};

const REGION_CONTEXT: Record<Region, string> = {
	scotland: "Mackintosh spent most of his career across 6 locations in Scotland, primarily in and around Glasgow.",
	europe: "Mackintosh exhibited his work across 5 European cities, earning international recognition far beyond Scotland.",
};

function MapPin({
	location,
	active,
	onClick,
}: {
	location: Location;
	active: boolean;
	onClick: () => void;
}) {
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: wireframe prototype
		// biome-ignore lint/a11y/noStaticElementInteractions: wireframe prototype
		<div
			className="absolute"
			style={{ top: location.top, left: location.left }}
			onClick={onClick}
		>
			<div className="group relative cursor-pointer">
				{/* Always-visible title above the pin */}
				<div className="absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap">
					<p className={`font-mono text-label font-medium ${active ? "text-gray-900" : "text-gray-500"}`}>
						{location.label}
					</p>
				</div>
				{/* Pin dot */}
				<div
					className={`h-4 w-4 rounded-full border-2 border-white shadow-md transition-colors ${
						active ? "bg-gray-800" : "bg-gray-500 hover:bg-gray-700"
					}`}
				/>
				{/* Active tooltip */}
				{active && (
					<div className="absolute left-6 top-0 z-10 w-72 border border-gray-300 bg-white shadow-lg">
						<div className="flex h-36 items-center justify-center bg-gray-100">
							<span className="font-mono text-label text-gray-400">[Artwork image]</span>
						</div>
						<div className="p-3">
							<p className="font-mono text-body font-semibold text-gray-900">{location.label}</p>
							<p className="mt-0.5 font-mono text-label uppercase tracking-[0.06em] text-gray-400">{location.info}</p>
							<p className="mt-2 font-mono text-meta text-gray-600">
								[Description of the work or location — period, medium, significance to the collection.]
							</p>
							<p className="mt-3 font-mono text-label uppercase tracking-[0.06em] text-gray-700 underline cursor-pointer">
								View in collection →
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function MapContent() {
	const [region, setRegion] = useState<Region>("scotland");
	const [activePin, setActivePin] = useState<string | null>(null);
	const [zoom, setZoom] = useState(1);
	const detailRef = useRef<HTMLDivElement>(null);

	const locations = LOCATIONS[region];
	const activeLoc = locations.find((l) => l.label === activePin) ?? null;

	const zoomIn = () => setZoom((z) => Math.min(+(z + 0.25).toFixed(2), 3));
	const zoomOut = () => setZoom((z) => Math.max(+(z - 0.25).toFixed(2), 0.5));
	const zoomReset = () => setZoom(1);

	function selectPin(label: string) {
		const next = activePin === label ? null : label;
		setActivePin(next);
		if (next) {
			setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
		}
	}

	return (
		<ScopePage id="map">
			<div className="min-h-screen bg-white">
				<NtsHeader
					breadcrumb={[
						{ label: "Home" },
						{ label: "Collections" },
						{ label: "Charles Rennie Mackintosh" },
						{ label: "Map" },
					]}
				/>

				<WireframeSection label="Page header" className="border-b border-gray-200 py-10">
					<Container>
						<SectionLabel>Mackintosh Collection</SectionLabel>
						<h1 className="mt-2 font-mono text-page font-semibold leading-tight tracking-tight">
							Mackintosh in the World
						</h1>
						<p className="mt-3 max-w-2xl font-mono text-body text-gray-600">
							Discover where Mackintosh lived, worked, and exhibited — and explore
							the artworks and buildings connected to each location.
						</p>
					</Container>
				</WireframeSection>

				<WireframeSection label="Map explorer" className="py-10">
					<Container size="xl">

						{/* Region toggle — centred */}
						<div className="mb-3 flex justify-center">
							<div className="flex items-center border border-gray-300">
								{(["scotland", "europe"] as const).map((r) => (
									<button
										key={r}
										type="button"
										onClick={() => { setRegion(r); setActivePin(null); }}
										className={`px-8 py-2 font-mono text-label uppercase tracking-[0.08em] transition-colors ${
											region === r ? "bg-gray-800 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
										}`}
									>
										{r === "scotland" ? "Scotland" : "Europe"}
									</button>
								))}
							</div>
						</div>

						{/* Context sentence — updates with region */}
						<p className="mb-6 text-center font-mono text-meta text-gray-500">
							{REGION_CONTEXT[region]}
						</p>

						{/* Map area */}
						<div className="relative overflow-hidden border border-gray-300 bg-gray-100" style={{ height: "520px" }}>
							<div className="absolute inset-0 flex items-center justify-center">
								<span className="font-mono text-meta text-gray-400">
									[{region === "scotland" ? "Scotland" : "Europe"} map — interactive]
								</span>
							</div>
							<div
								className="absolute inset-0 opacity-10"
								style={{
									backgroundImage: "linear-gradient(#666 1px, transparent 1px), linear-gradient(90deg, #666 1px, transparent 1px)",
									backgroundSize: "40px 40px",
								}}
							/>
							{/* Pins layer — zoom applied here */}
							<div
								className="absolute inset-0"
								style={{
									transform: `scale(${zoom})`,
									transformOrigin: "center center",
									transition: "transform 0.2s ease",
								}}
							>
								{locations.map((loc) => (
									<MapPin
										key={loc.label}
										location={loc}
										active={activePin === loc.label}
										onClick={() => selectPin(loc.label)}
									/>
								))}
							</div>
							{/* Zoom controls */}
							<div className="absolute bottom-4 right-4 z-30 flex flex-col items-center gap-1">
								<button
									type="button"
									onClick={zoomIn}
									className="flex h-8 w-8 items-center justify-center border border-gray-400 bg-white font-mono text-body text-gray-700 shadow-sm hover:bg-gray-50"
								>
									+
								</button>
								<button
									type="button"
									onClick={zoomReset}
									className="flex h-7 w-8 items-center justify-center border border-gray-300 bg-white font-mono text-label text-gray-500 shadow-sm hover:bg-gray-50"
								>
									{Math.round(zoom * 100)}%
								</button>
								<button
									type="button"
									onClick={zoomOut}
									className="flex h-8 w-8 items-center justify-center border border-gray-400 bg-white font-mono text-body text-gray-700 shadow-sm hover:bg-gray-50"
								>
									−
								</button>
							</div>
						</div>

						{/* Legend */}
						<div className="mt-4 flex items-center gap-4">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded-full bg-gray-500" />
								<span className="font-mono text-meta text-gray-500">Location — hover to preview, click to explore</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded-full bg-gray-800" />
								<span className="font-mono text-meta text-gray-500">Selected</span>
							</div>
						</div>

						{/* All locations list */}
						<div className="mt-8">
							<SectionLabel className="mb-4">All locations</SectionLabel>
							<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
								{locations.map((loc) => (
									<button
										key={loc.label}
										type="button"
										onClick={() => selectPin(loc.label)}
										className={`flex items-center gap-3 border p-3 text-left transition-colors ${
											activePin === loc.label
												? "border-gray-800 bg-gray-50"
												: "border-gray-200 hover:border-gray-400"
										}`}
									>
										<div className="h-2.5 w-2.5 shrink-0 rounded-full bg-gray-500" />
										<div>
											<p className="font-mono text-meta font-medium text-gray-700">{loc.label}</p>
											<p className="font-mono text-label text-gray-400">{loc.info}</p>
										</div>
									</button>
								))}
							</div>
						</div>

						{/* Detail panel — always rendered; empty state when nothing selected */}
						<div
							ref={detailRef}
							className="mt-10 border-t border-gray-200 pt-8"
							style={{ scrollMarginTop: "80px" }}
						>
							{!activeLoc ? (
								<p className="py-6 text-center font-mono text-meta text-gray-400">
									Select a location on the map or from the list above to explore associated artworks.
								</p>
							) : (
								<div
									className="transition-all duration-500"
									style={{ opacity: 1, transform: "translateY(0)" }}
								>
									<SectionLabel className="mb-6">Selected location</SectionLabel>
									<div className="flex gap-8">
										<div className="flex h-48 w-64 shrink-0 items-center justify-center border border-gray-300 bg-gray-100">
											<span className="font-mono text-label text-gray-400">[Artwork image]</span>
										</div>
										<div className="flex flex-col justify-center">
											<h2 className="font-mono text-section font-semibold text-gray-900">{activeLoc.label}</h2>
											<p className="mt-1 font-mono text-label uppercase tracking-[0.06em] text-gray-400">{activeLoc.info}</p>
											<p className="mt-3 max-w-lg font-mono text-body text-gray-600">
												[Description of the work or location — period, medium, and its significance to the Mackintosh collection.]
											</p>
											<a
												href="/collection-search"
												className="mt-5 self-start border border-gray-800 px-4 py-2 font-mono text-label uppercase tracking-[0.08em] text-gray-900 hover:bg-gray-50"
											>
												View in collection →
											</a>
										</div>
									</div>

									{/* Associated artworks */}
									<div className="mt-8">
										<p className="mb-4 font-mono text-label uppercase tracking-[0.08em] text-gray-500">
											Associated artworks
										</p>
										<div className="flex gap-4">
											{activeLoc.artworks.map((art) => (
												<a
													key={art.title}
													href="/collection-search"
													className="group relative w-40 shrink-0 border border-gray-300 transition-colors hover:border-gray-600"
												>
													<div className="relative flex h-28 items-center justify-center overflow-hidden bg-gray-100">
														<span className="font-mono text-label text-gray-400">[Image]</span>
														<div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 p-2 opacity-0 transition-opacity group-hover:opacity-100">
															<span className="text-center font-mono text-label font-medium leading-tight text-white">{art.title}</span>
															<span className="mt-1 font-mono text-[10px] text-gray-300">View →</span>
														</div>
													</div>
													<div className="p-2">
														<p className="font-mono text-label font-medium leading-tight text-gray-700">{art.title}</p>
														<p className="mt-0.5 font-mono text-[10px] text-gray-400">{art.meta}</p>
													</div>
												</a>
											))}
										</div>
									</div>
								</div>
							)}
						</div>

					</Container>
				</WireframeSection>

				<NtsFooter />
			</div>
		</ScopePage>
	);
}

export default function MapPage() {
	return (
		<Suspense>
			<MapContent />
		</Suspense>
	);
}
