"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import {
	Container,
	ImagePlaceholder,
	SectionLabel,
	WireframeSection,
} from "@/components/wireframe";
import NtsFooter from "@/components/wireframe/NtsFooter";
import NtsHeader from "@/components/wireframe/NtsHeader";
import { ScopePage } from "@/providers/ScopeProvider";

// ── Types ──────────────────────────────────────────────────────────────

type CollectionType = "Architecture" | "Fine Art" | "Decorative Art" | "Archive";
type ObjectType =
	| "Architectural Drawing"
	| "Watercolour"
	| "Oil Painting"
	| "Furniture"
	| "Textile"
	| "Photograph"
	| "Letter"
	| "Print"
	| "Poster"
	| "Metalwork"
	| "Sketch";
type Location =
	| "Hill House"
	| "Willow Tea Rooms"
	| "Glasgow School of Art"
	| "House for an Art Lover"
	| "Queen's Cross Church"
	| "Hunterian Museum";
type Creator =
	| "Charles Rennie Mackintosh"
	| "Margaret Macdonald Mackintosh"
	| "Frances Macdonald"
	| "Herbert MacNair"
	| "Unknown";

interface CRMItem {
	id: string;
	collectionType: CollectionType;
	objectType: ObjectType;
	title: string;
	creator: Creator;
	dateCreated: string;
	accessionNumber: string;
	location: Location;
	hasImage: boolean;
	onDisplay: boolean;
}

// ── Mock data ───────────────────────────────────────────────────────────

const ALL_ITEMS: CRMItem[] = [
	{ id: "crm01", collectionType: "Architecture", objectType: "Architectural Drawing", title: "Glasgow School of Art, North Elevation", creator: "Charles Rennie Mackintosh", dateCreated: "1897", accessionNumber: "GSAA/DC/002/001", location: "Glasgow School of Art", hasImage: true, onDisplay: true },
	{ id: "crm02", collectionType: "Fine Art", objectType: "Watercolour", title: "Pinks", creator: "Charles Rennie Mackintosh", dateCreated: "1915", accessionNumber: "GLAHA/F/0234", location: "Hunterian Museum", hasImage: true, onDisplay: true },
	{ id: "crm03", collectionType: "Decorative Art", objectType: "Furniture", title: "Ladder-back Chair", creator: "Charles Rennie Mackintosh", dateCreated: "1903", accessionNumber: "HH/F/0042", location: "Hill House", hasImage: true, onDisplay: true },
	{ id: "crm04", collectionType: "Fine Art", objectType: "Watercolour", title: "Anemones", creator: "Margaret Macdonald Mackintosh", dateCreated: "1916", accessionNumber: "GLAHA/F/0301", location: "Hunterian Museum", hasImage: true, onDisplay: false },
	{ id: "crm05", collectionType: "Architecture", objectType: "Architectural Drawing", title: "Hill House, Helensburgh — Ground Floor Plan", creator: "Charles Rennie Mackintosh", dateCreated: "1902", accessionNumber: "GSAA/DC/012/003", location: "Hill House", hasImage: false, onDisplay: false },
	{ id: "crm06", collectionType: "Decorative Art", objectType: "Textile", title: "Embroidered Panel with Rose Motif", creator: "Margaret Macdonald Mackintosh", dateCreated: "1902", accessionNumber: "HH/T/0011", location: "Hill House", hasImage: true, onDisplay: true },
	{ id: "crm07", collectionType: "Archive", objectType: "Letter", title: "Letter from CRM to Hermann Muthesius regarding the Haus eines Kunstfreundes", creator: "Charles Rennie Mackintosh", dateCreated: "1901", accessionNumber: "GSAA/AR/1901/047", location: "Glasgow School of Art", hasImage: false, onDisplay: false },
	{ id: "crm08", collectionType: "Fine Art", objectType: "Watercolour", title: "Holy Island", creator: "Charles Rennie Mackintosh", dateCreated: "1901", accessionNumber: "GLAHA/F/0189", location: "Hunterian Museum", hasImage: true, onDisplay: false },
	{ id: "crm09", collectionType: "Decorative Art", objectType: "Metalwork", title: "Silver Candlestick", creator: "Charles Rennie Mackintosh", dateCreated: "1896", accessionNumber: "GLAHA/D/0055", location: "Hunterian Museum", hasImage: true, onDisplay: true },
	{ id: "crm10", collectionType: "Archive", objectType: "Photograph", title: "Interior of the Willow Tea Rooms, Sauchiehall Street", creator: "Unknown", dateCreated: "c.1904", accessionNumber: "WTR/PH/0003", location: "Willow Tea Rooms", hasImage: true, onDisplay: false },
	{ id: "crm11", collectionType: "Architecture", objectType: "Architectural Drawing", title: "Willow Tea Rooms — Section through the Room de Luxe", creator: "Charles Rennie Mackintosh", dateCreated: "1903", accessionNumber: "GSAA/DC/021/009", location: "Willow Tea Rooms", hasImage: true, onDisplay: false },
	{ id: "crm12", collectionType: "Fine Art", objectType: "Poster", title: "The Scottish Musical Review", creator: "Charles Rennie Mackintosh", dateCreated: "1896", accessionNumber: "GLAHA/F/0021", location: "Hunterian Museum", hasImage: true, onDisplay: true },
	{ id: "crm13", collectionType: "Decorative Art", objectType: "Furniture", title: "Writing Cabinet", creator: "Charles Rennie Mackintosh", dateCreated: "1904", accessionNumber: "GLAHA/D/0078", location: "Hunterian Museum", hasImage: true, onDisplay: true },
	{ id: "crm14", collectionType: "Fine Art", objectType: "Oil Painting", title: "The Descent of Night", creator: "Frances Macdonald", dateCreated: "1894", accessionNumber: "GLAHA/F/0445", location: "Hunterian Museum", hasImage: true, onDisplay: false },
	{ id: "crm15", collectionType: "Architecture", objectType: "Architectural Drawing", title: "Queen's Cross Church — West Elevation", creator: "Charles Rennie Mackintosh", dateCreated: "1897", accessionNumber: "GSAA/DC/007/002", location: "Glasgow School of Art", hasImage: false, onDisplay: false },
	{ id: "crm16", collectionType: "Archive", objectType: "Letter", title: "Letter from Margaret Macdonald to Jessie Newbery", creator: "Margaret Macdonald Mackintosh", dateCreated: "1900", accessionNumber: "GSAA/AR/1900/012", location: "Glasgow School of Art", hasImage: false, onDisplay: false },
	{ id: "crm17", collectionType: "Fine Art", objectType: "Watercolour", title: "Walberswick Flowers — White Roses", creator: "Charles Rennie Mackintosh", dateCreated: "1914", accessionNumber: "GLAHA/F/0267", location: "Hunterian Museum", hasImage: true, onDisplay: true },
	{ id: "crm18", collectionType: "Decorative Art", objectType: "Furniture", title: "Linen Press", creator: "Charles Rennie Mackintosh", dateCreated: "1902", accessionNumber: "HH/F/0019", location: "Hill House", hasImage: true, onDisplay: true },
	{ id: "crm19", collectionType: "Fine Art", objectType: "Sketch", title: "Studies of Trees, Chiddingstone", creator: "Charles Rennie Mackintosh", dateCreated: "1910", accessionNumber: "GLAHA/F/0198", location: "Hunterian Museum", hasImage: false, onDisplay: false },
	{ id: "crm20", collectionType: "Archive", objectType: "Photograph", title: "Charles Rennie Mackintosh, portrait", creator: "Unknown", dateCreated: "c.1893", accessionNumber: "GSAA/PH/0001", location: "Glasgow School of Art", hasImage: true, onDisplay: false },
	{ id: "crm21", collectionType: "Decorative Art", objectType: "Textile", title: "Curtain with Stylised Leaves", creator: "Margaret Macdonald Mackintosh", dateCreated: "1900", accessionNumber: "GLAHA/D/0101", location: "Hunterian Museum", hasImage: true, onDisplay: false },
	{ id: "crm22", collectionType: "Architecture", objectType: "Architectural Drawing", title: "House for an Art Lover — Music Room Interior", creator: "Charles Rennie Mackintosh", dateCreated: "1901", accessionNumber: "GSAA/DC/018/004", location: "House for an Art Lover", hasImage: true, onDisplay: true },
	{ id: "crm23", collectionType: "Fine Art", objectType: "Watercolour", title: "Fetges", creator: "Charles Rennie Mackintosh", dateCreated: "1927", accessionNumber: "GLAHA/F/0312", location: "Hunterian Museum", hasImage: true, onDisplay: true },
	{ id: "crm24", collectionType: "Decorative Art", objectType: "Metalwork", title: "Door Handle Plate, Hill House", creator: "Charles Rennie Mackintosh", dateCreated: "1903", accessionNumber: "HH/M/0007", location: "Hill House", hasImage: true, onDisplay: true },
];

const COLLECTION_TYPES: CollectionType[] = ["Architecture", "Fine Art", "Decorative Art", "Archive"];
const OBJECT_TYPES: ObjectType[] = ["Architectural Drawing", "Watercolour", "Oil Painting", "Furniture", "Textile", "Photograph", "Letter", "Print", "Poster", "Metalwork", "Sketch"];
const LOCATIONS: Location[] = ["Hill House", "Willow Tea Rooms", "Glasgow School of Art", "House for an Art Lover", "Queen's Cross Church", "Hunterian Museum"];
const CREATORS: Creator[] = ["Charles Rennie Mackintosh", "Margaret Macdonald Mackintosh", "Frances Macdonald", "Herbert MacNair", "Unknown"];

const PAGE_SIZE = 12;

// ── Filter helpers ──────────────────────────────────────────────────────

interface Filters {
	query: string;
	hasImage: boolean;
	onDisplay: boolean;
	collectionType: CollectionType[];
	objectType: ObjectType[];
	location: Location[];
	creator: Creator[];
}

function emptyFilters(): Filters {
	return { query: "", hasImage: false, onDisplay: false, collectionType: [], objectType: [], location: [], creator: [] };
}

function applyFilters(items: CRMItem[], f: Filters): CRMItem[] {
	return items.filter((item) => {
		if (f.hasImage && !item.hasImage) return false;
		if (f.onDisplay && !item.onDisplay) return false;
		if (f.collectionType.length > 0 && !f.collectionType.includes(item.collectionType)) return false;
		if (f.objectType.length > 0 && !f.objectType.includes(item.objectType)) return false;
		if (f.location.length > 0 && !f.location.includes(item.location)) return false;
		if (f.creator.length > 0 && !f.creator.includes(item.creator)) return false;
		if (f.query) {
			const q = f.query.toLowerCase();
			if (!item.title.toLowerCase().includes(q) && !item.creator.toLowerCase().includes(q) && !item.accessionNumber.toLowerCase().includes(q)) return false;
		}
		return true;
	});
}

function toggle<T>(arr: T[], item: T): T[] {
	return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

// ── Sub-components ──────────────────────────────────────────────────────

function AccordionSection({ label, open, onToggle, children }: { label: string; open: boolean; onToggle: () => void; children: ReactNode }) {
	return (
		<div className="border-t border-gray-200">
			<button
				type="button"
				onClick={onToggle}
				className="flex w-full items-center justify-between bg-gray-700 px-3 py-2.5 text-left text-white hover:bg-gray-600"
			>
				<span className="font-mono text-meta font-medium">{label}</span>
				<span className="font-mono text-meta" aria-hidden="true">{open ? "^" : "v"}</span>
			</button>
			{open && (
				<div className="space-y-1.5 border border-t-0 border-gray-200 bg-white px-3 py-3">
					{children}
				</div>
			)}
		</div>
	);
}

function CheckOption({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count?: number }) {
	return (
		<label className="group flex cursor-pointer items-center gap-2">
			<input type="checkbox" checked={checked} onChange={onChange} className="accent-gray-700" />
			<span className="flex-1 font-mono text-meta text-gray-700 group-hover:text-black">{label}</span>
			{count !== undefined && <span className="font-mono text-label text-gray-400 tabular-nums">({count})</span>}
		</label>
	);
}

function ResultCard({ item }: { item: CRMItem }) {
	return (
		<article className="flex flex-col border border-gray-200 bg-white hover:border-gray-400">
			<ImagePlaceholder className="aspect-square w-full" />
			<div className="flex flex-1 flex-col gap-1.5 p-3">
				<span className="inline-block self-start border border-gray-400 bg-gray-100 px-1.5 py-0.5 font-mono text-label uppercase tracking-[0.08em] text-gray-600">
					{item.objectType}
				</span>
				<h3 className="font-mono text-meta font-medium leading-snug text-gray-900">{item.title}</h3>
				<p className="font-mono text-label text-gray-500">Date created: {item.dateCreated}</p>
				<div className="mt-auto border-t border-gray-100 pt-2">
					<p className="font-mono text-label uppercase tracking-[0.08em] text-gray-500">
						{item.collectionType === "Archive" ? "Archive number" : "Object number"}:{" "}
						<span className="tabular-nums">{item.accessionNumber}</span>
					</p>
				</div>
			</div>
		</article>
	);
}

// ── Page ────────────────────────────────────────────────────────────────

type OpenAccordion = "collectionType" | "objectType" | "location" | "creator" | "date" | null;
type SortOrder = "relevance" | "dateAsc" | "dateDesc" | "titleAz";

function CRMSearchContent() {
	const [filters, setFilters] = useState<Filters>(emptyFilters());
	const [query, setQuery] = useState("");
	const [sort, setSort] = useState<SortOrder>("relevance");
	const [open, setOpen] = useState<OpenAccordion>(null);
	const [page, setPage] = useState(1);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const resultsRef = useRef<HTMLDivElement>(null);

	const results = applyFilters(ALL_ITEMS, { ...filters, query });
	const sorted = sort === "titleAz" ? [...results].sort((a, b) => a.title.localeCompare(b.title))
		: sort === "dateAsc" ? [...results].sort((a, b) => a.dateCreated.localeCompare(b.dateCreated))
		: sort === "dateDesc" ? [...results].sort((a, b) => b.dateCreated.localeCompare(a.dateCreated))
		: results;

	const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
	const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	const activeCount = (filters.hasImage ? 1 : 0) + (filters.onDisplay ? 1 : 0) + filters.collectionType.length + filters.objectType.length + filters.location.length + filters.creator.length;

	useEffect(() => { setPage(1); }, [filters, query, sort]);

	function goToPage(n: number) {
		setPage(n);
		resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	function setF<K extends keyof Filters>(key: K, value: Filters[K]) {
		setFilters((prev) => ({ ...prev, [key]: value }));
	}

	return (
		<ScopePage id="crm-search">
			<div className="min-h-screen bg-white">
				<NtsHeader breadcrumb={[{ label: "Home" }, { label: "Collections" }, { label: "Charles Rennie Mackintosh" }, { label: "Search" }]} />

				{/* Hero */}
				<WireframeSection label="Hero" className="relative">
					<ImagePlaceholder className="h-36 w-full" label="[hero image]" />
					<div className="absolute inset-0 flex items-center justify-center bg-black/30">
						<h1 className="font-mono text-page font-medium tracking-tight text-white">
							Search the collection
						</h1>
					</div>
				</WireframeSection>

				{/* Search bar */}
				<WireframeSection label="Search bar" className="px-6 py-8 text-center">
					<p className="mb-4 font-mono text-body font-medium">What are you looking for?</p>
					<form
						onSubmit={(e) => e.preventDefault()}
						className="mx-auto flex max-w-xl border border-gray-400 focus-within:border-gray-800 hover:border-gray-600"
					>
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search by name, object type or accession number"
							className="flex-1 px-4 py-2.5 font-mono text-meta outline-none placeholder:text-gray-400"
						/>
						<button type="submit" className="border-l border-gray-400 px-4 py-2.5 font-mono text-meta text-gray-600 hover:bg-gray-100">
							[search]
						</button>
					</form>
				</WireframeSection>

				{/* Results count bar */}
				<div ref={resultsRef} className="border-t border-gray-300 px-6 py-8 text-center">
					<div className="mx-auto max-w-md border border-gray-300 bg-white px-6 py-4">
						<p className="font-mono text-meta text-gray-600">
							{results.length < ALL_ITEMS.length
								? `Showing ${results.length} of ${ALL_ITEMS.length} results.`
								: `Showing ${ALL_ITEMS.length} results.`}
							{activeCount > 0 && (
								<button
									type="button"
									onClick={() => setFilters(emptyFilters())}
									className="ml-3 font-mono text-label text-gray-500 underline hover:text-black"
								>
									Clear {activeCount} filter{activeCount !== 1 ? "s" : ""}
								</button>
							)}
						</p>
					</div>
				</div>

				{/* Sort */}
				<div className="px-6 pb-8">
					<div className="flex justify-end">
						<div className="flex flex-col items-end gap-1">
							<label htmlFor="crm-sort" className="font-mono text-label uppercase tracking-[0.08em] text-gray-500">
								Sort results by
							</label>
							<select
								id="crm-sort"
								value={sort}
								onChange={(e) => setSort(e.target.value as SortOrder)}
								className="border border-gray-300 font-mono text-meta outline-none hover:border-gray-500"
							>
								<option value="relevance">Relevance</option>
								<option value="dateAsc">Date (oldest first)</option>
								<option value="dateDesc">Date (newest first)</option>
								<option value="titleAz">Title A-Z</option>
							</select>
						</div>
					</div>
				</div>

				{/* Layout */}
				<div className="flex flex-col px-6 lg:flex-row">
					{/* Sidebar */}
					<WireframeSection label="Filters" className="w-full border-2 border-red-500 lg:w-56 lg:shrink-0 lg:self-start lg:sticky lg:top-0">
						<button
							type="button"
							onClick={() => setFiltersOpen((o) => !o)}
							className="flex w-full items-center justify-between bg-gray-700 px-3 py-2.5 text-left lg:cursor-default"
						>
							<span className="font-mono text-meta font-medium uppercase tracking-[0.08em] text-white lg:hidden">
								Filter Search Results
							</span>
							<span className="hidden font-mono text-meta font-medium uppercase tracking-[0.08em] text-white lg:inline">
								Filter by
							</span>
							<span className="font-mono text-meta text-white lg:hidden" aria-hidden="true">{filtersOpen ? "▴" : "▾"}</span>
						</button>
						<div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
						<div className="space-y-2 border-b border-gray-300 px-3 py-3">
							<CheckOption
								label={`Has image (${ALL_ITEMS.filter((i) => i.hasImage).length})`}
								checked={filters.hasImage}
								onChange={() => setF("hasImage", !filters.hasImage)}
							/>
							<CheckOption
								label={`On display (${ALL_ITEMS.filter((i) => i.onDisplay).length})`}
								checked={filters.onDisplay}
								onChange={() => setF("onDisplay", !filters.onDisplay)}
							/>
						</div>
						<AccordionSection label="Collection type" open={open === "collectionType"} onToggle={() => setOpen(open === "collectionType" ? null : "collectionType")}>
							{COLLECTION_TYPES.map((ct) => (
								<CheckOption key={ct} label={ct} checked={filters.collectionType.includes(ct)} onChange={() => setF("collectionType", toggle(filters.collectionType, ct))} count={ALL_ITEMS.filter((i) => i.collectionType === ct).length} />
							))}
						</AccordionSection>
						<AccordionSection label="Object type" open={open === "objectType"} onToggle={() => setOpen(open === "objectType" ? null : "objectType")}>
							{OBJECT_TYPES.filter((ot) => ALL_ITEMS.some((i) => i.objectType === ot)).map((ot) => (
								<CheckOption key={ot} label={ot} checked={filters.objectType.includes(ot)} onChange={() => setF("objectType", toggle(filters.objectType, ot))} count={ALL_ITEMS.filter((i) => i.objectType === ot).length} />
							))}
						</AccordionSection>
						<AccordionSection label="Location / building" open={open === "location"} onToggle={() => setOpen(open === "location" ? null : "location")}>
							{LOCATIONS.map((loc) => (
								<CheckOption key={loc} label={loc} checked={filters.location.includes(loc)} onChange={() => setF("location", toggle(filters.location, loc))} count={ALL_ITEMS.filter((i) => i.location === loc).length} />
							))}
						</AccordionSection>
						<AccordionSection label="Creator" open={open === "creator"} onToggle={() => setOpen(open === "creator" ? null : "creator")}>
							{CREATORS.filter((cr) => ALL_ITEMS.some((i) => i.creator === cr)).map((cr) => (
								<CheckOption key={cr} label={cr} checked={filters.creator.includes(cr)} onChange={() => setF("creator", toggle(filters.creator, cr))} count={ALL_ITEMS.filter((i) => i.creator === cr).length} />
							))}
						</AccordionSection>
						<div className="hidden p-3 lg:block">
							<a href="#" className="block border border-gray-400 bg-gray-100 px-3 py-2 text-center font-mono text-label uppercase tracking-[0.08em] text-gray-700 hover:bg-gray-200">
								Contact us about the collection
							</a>
						</div>
						</div>
					</WireframeSection>

					{/* Results */}
					<WireframeSection label="Results grid" className="flex-1 p-6">
						{pageItems.length === 0 ? (
							<div className="border border-dashed border-gray-300 py-20 text-center font-mono text-meta text-gray-400">
								No items match your filters.
							</div>
						) : (
							<div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
								{pageItems.map((item) => (
									<ResultCard key={item.id} item={item} />
								))}
							</div>
						)}

						{totalPages > 1 && (
							<div className="mt-12 flex items-center justify-center gap-2">
								<button type="button" disabled={page === 1} onClick={() => goToPage(page - 1)} className="border border-gray-300 px-3 py-1.5 font-mono text-meta hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-30">
									Previous
								</button>
								{Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
									<button key={n} type="button" onClick={() => goToPage(n)} className={`border px-3 py-1.5 font-mono text-meta ${page === n ? "border-gray-800 bg-gray-800 text-white" : "border-gray-300 hover:border-gray-500"}`}>
										{n}
									</button>
								))}
								{totalPages > 5 && <span className="font-mono text-meta text-gray-400">... {totalPages}</span>}
								<button type="button" disabled={page === totalPages} onClick={() => goToPage(page + 1)} className="border border-gray-300 px-3 py-1.5 font-mono text-meta hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-30">
									Next
								</button>
							</div>
						)}

						<div className="mt-8 lg:hidden">
							<a href="#" className="block border border-gray-400 bg-gray-100 px-3 py-2 text-center font-mono text-label uppercase tracking-[0.08em] text-gray-700 hover:bg-gray-200">
								Contact us about the collection
							</a>
						</div>
					</WireframeSection>
				</div>

				<NtsFooter />
			</div>
		</ScopePage>
	);
}

export default function CRMSearchPage() {
	return (
		<Suspense>
			<CRMSearchContent />
		</Suspense>
	);
}
