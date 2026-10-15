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
	creators: Creator[];
	designers: string[];
	makers: string[];
	dateCreated: string;
	accessionNumber: string;
	location: Location;
	hasImage: boolean;
	materials: string[];
	associatedPeople: string[];
	onDisplay: boolean;
}

// ── Mock data ───────────────────────────────────────────────────────────

const ALL_ITEMS: CRMItem[] = [
	{ id: "crm01", collectionType: "Architecture", objectType: "Architectural Drawing", title: "Glasgow School of Art, North Elevation", creators: ["Charles Rennie Mackintosh"], designers: ["Charles Rennie Mackintosh"], makers: ["Honeyman & Keppie"], dateCreated: "1897", accessionNumber: "GSAA/DC/002/001", location: "Glasgow School of Art", hasImage: true, materials: ["Pencil", "Ink", "Paper"], associatedPeople: ["Francis Newbery"], onDisplay: true },
	{ id: "crm02", collectionType: "Fine Art", objectType: "Watercolour", title: "Pinks", creators: ["Charles Rennie Mackintosh"], designers: [], makers: [], dateCreated: "1915", accessionNumber: "GLAHA/F/0234", location: "Hunterian Museum", hasImage: true, materials: ["Watercolour", "Paper"], associatedPeople: [], onDisplay: true },
	{ id: "crm03", collectionType: "Decorative Art", objectType: "Furniture", title: "Ladder-back Chair", creators: ["Charles Rennie Mackintosh"], designers: ["Charles Rennie Mackintosh"], makers: ["Alex Martin"], dateCreated: "1903", accessionNumber: "HH/F/0042", location: "Hill House", hasImage: true, materials: ["Oak", "Stain"], associatedPeople: ["Walter Blackie"], onDisplay: true },
	{ id: "crm04", collectionType: "Fine Art", objectType: "Watercolour", title: "Anemones", creators: ["Margaret Macdonald Mackintosh"], designers: [], makers: [], dateCreated: "1916", accessionNumber: "GLAHA/F/0301", location: "Hunterian Museum", hasImage: true, materials: ["Watercolour", "Paper"], associatedPeople: ["Charles Rennie Mackintosh"], onDisplay: false },
	{ id: "crm05", collectionType: "Architecture", objectType: "Architectural Drawing", title: "Hill House, Helensburgh — Ground Floor Plan", creators: ["Charles Rennie Mackintosh"], designers: ["Charles Rennie Mackintosh"], makers: ["Honeyman & Keppie"], dateCreated: "1902", accessionNumber: "GSAA/DC/012/003", location: "Hill House", hasImage: false, materials: ["Pencil", "Ink", "Paper"], associatedPeople: ["Walter Blackie"], onDisplay: false },
	{ id: "crm06", collectionType: "Decorative Art", objectType: "Textile", title: "Embroidered Panel with Rose Motif", creators: ["Margaret Macdonald Mackintosh"], designers: ["Margaret Macdonald Mackintosh"], makers: ["Margaret Macdonald Mackintosh"], dateCreated: "1902", accessionNumber: "HH/T/0011", location: "Hill House", hasImage: true, materials: ["Linen", "Silk"], associatedPeople: ["Walter Blackie"], onDisplay: true },
	{ id: "crm07", collectionType: "Archive", objectType: "Letter", title: "Letter from CRM to Hermann Muthesius regarding the Haus eines Kunstfreundes", creators: ["Charles Rennie Mackintosh"], designers: [], makers: [], dateCreated: "1901", accessionNumber: "GSAA/AR/1901/047", location: "Glasgow School of Art", hasImage: false, materials: ["Ink", "Paper"], associatedPeople: ["Hermann Muthesius"], onDisplay: false },
	{ id: "crm08", collectionType: "Fine Art", objectType: "Watercolour", title: "Holy Island", creators: ["Charles Rennie Mackintosh"], designers: [], makers: [], dateCreated: "1901", accessionNumber: "GLAHA/F/0189", location: "Hunterian Museum", hasImage: true, materials: ["Watercolour", "Pencil", "Paper"], associatedPeople: [], onDisplay: false },
	{ id: "crm09", collectionType: "Decorative Art", objectType: "Metalwork", title: "Silver Candlestick", creators: ["Charles Rennie Mackintosh"], designers: ["Charles Rennie Mackintosh"], makers: ["Kellock Brown"], dateCreated: "1896", accessionNumber: "GLAHA/D/0055", location: "Hunterian Museum", hasImage: true, materials: ["Silver"], associatedPeople: [], onDisplay: true },
	{ id: "crm10", collectionType: "Archive", objectType: "Photograph", title: "Interior of the Willow Tea Rooms, Sauchiehall Street", creators: ["Unknown"], designers: [], makers: ["T. & R. Annan & Sons"], dateCreated: "c.1904", accessionNumber: "WTR/PH/0003", location: "Willow Tea Rooms", hasImage: true, materials: ["Silver gelatin print"], associatedPeople: ["Catherine Cranston"], onDisplay: false },
	{ id: "crm11", collectionType: "Architecture", objectType: "Architectural Drawing", title: "Willow Tea Rooms — Section through the Room de Luxe", creators: ["Charles Rennie Mackintosh"], designers: ["Charles Rennie Mackintosh"], makers: ["Honeyman & Keppie"], dateCreated: "1903", accessionNumber: "GSAA/DC/021/009", location: "Willow Tea Rooms", hasImage: true, materials: ["Pencil", "Watercolour", "Paper"], associatedPeople: ["Catherine Cranston"], onDisplay: false },
	{ id: "crm12", collectionType: "Fine Art", objectType: "Poster", title: "The Scottish Musical Review", creators: ["Charles Rennie Mackintosh"], designers: ["Charles Rennie Mackintosh"], makers: ["Carter & Pratt"], dateCreated: "1896", accessionNumber: "GLAHA/F/0021", location: "Hunterian Museum", hasImage: true, materials: ["Ink", "Paper"], associatedPeople: [], onDisplay: true },
	{ id: "crm13", collectionType: "Decorative Art", objectType: "Furniture", title: "Writing Cabinet", creators: ["Charles Rennie Mackintosh", "Margaret Macdonald Mackintosh"], designers: ["Charles Rennie Mackintosh"], makers: ["Francis Smith & Son"], dateCreated: "1904", accessionNumber: "GLAHA/D/0078", location: "Hunterian Museum", hasImage: true, materials: ["Ebonised wood", "Mother of Pearl", "Glass"], associatedPeople: ["Fritz Waerndorfer"], onDisplay: true },
	{ id: "crm14", collectionType: "Fine Art", objectType: "Oil Painting", title: "The Descent of Night", creators: ["Frances Macdonald"], designers: [], makers: [], dateCreated: "1894", accessionNumber: "GLAHA/F/0445", location: "Hunterian Museum", hasImage: true, materials: ["Oil paint", "Canvas"], associatedPeople: ["Herbert MacNair"], onDisplay: false },
	{ id: "crm15", collectionType: "Architecture", objectType: "Architectural Drawing", title: "Queen's Cross Church — West Elevation", creators: ["Charles Rennie Mackintosh"], designers: ["Charles Rennie Mackintosh"], makers: ["Honeyman & Keppie"], dateCreated: "1897", accessionNumber: "GSAA/DC/007/002", location: "Glasgow School of Art", hasImage: false, materials: ["Pencil", "Ink", "Paper"], associatedPeople: [], onDisplay: false },
	{ id: "crm16", collectionType: "Archive", objectType: "Letter", title: "Letter from Margaret Macdonald to Jessie Newbery", creators: ["Margaret Macdonald Mackintosh"], designers: [], makers: [], dateCreated: "1900", accessionNumber: "GSAA/AR/1900/012", location: "Glasgow School of Art", hasImage: false, materials: ["Ink", "Paper"], associatedPeople: ["Jessie Newbery"], onDisplay: false },
	{ id: "crm17", collectionType: "Fine Art", objectType: "Watercolour", title: "Walberswick Flowers — White Roses", creators: ["Charles Rennie Mackintosh"], designers: [], makers: [], dateCreated: "1914", accessionNumber: "GLAHA/F/0267", location: "Hunterian Museum", hasImage: true, materials: ["Watercolour", "Pencil", "Paper"], associatedPeople: ["Margaret Macdonald Mackintosh"], onDisplay: true },
	{ id: "crm18", collectionType: "Decorative Art", objectType: "Furniture", title: "Linen Press", creators: ["Charles Rennie Mackintosh"], designers: ["Charles Rennie Mackintosh"], makers: ["Alex Martin"], dateCreated: "1902", accessionNumber: "HH/F/0019", location: "Hill House", hasImage: true, materials: ["Pine", "Paint", "Glass"], associatedPeople: ["Walter Blackie"], onDisplay: true },
	{ id: "crm19", collectionType: "Fine Art", objectType: "Sketch", title: "Studies of Trees, Chiddingstone", creators: ["Charles Rennie Mackintosh"], designers: [], makers: [], dateCreated: "1910", accessionNumber: "GLAHA/F/0198", location: "Hunterian Museum", hasImage: false, materials: ["Pencil", "Paper"], associatedPeople: [], onDisplay: false },
	{ id: "crm20", collectionType: "Archive", objectType: "Photograph", title: "Charles Rennie Mackintosh, portrait", creators: ["Unknown"], designers: [], makers: ["T. & R. Annan & Sons"], dateCreated: "c.1893", accessionNumber: "GSAA/PH/0001", location: "Glasgow School of Art", hasImage: true, materials: ["Albumen print"], associatedPeople: ["Charles Rennie Mackintosh"], onDisplay: false },
	{ id: "crm21", collectionType: "Decorative Art", objectType: "Textile", title: "Curtain with Stylised Leaves", creators: ["Margaret Macdonald Mackintosh", "Frances Macdonald"], designers: ["Margaret Macdonald Mackintosh"], makers: ["Frances Macdonald"], dateCreated: "1900", accessionNumber: "GLAHA/D/0101", location: "Hunterian Museum", hasImage: true, materials: ["Linen", "Silk"], associatedPeople: [], onDisplay: false },
	{ id: "crm22", collectionType: "Architecture", objectType: "Architectural Drawing", title: "House for an Art Lover — Music Room Interior", creators: ["Charles Rennie Mackintosh", "Margaret Macdonald Mackintosh"], designers: ["Charles Rennie Mackintosh"], makers: [], dateCreated: "1901", accessionNumber: "GSAA/DC/018/004", location: "House for an Art Lover", hasImage: true, materials: ["Pencil", "Watercolour", "Paper"], associatedPeople: ["Alexander Koch"], onDisplay: true },
	{ id: "crm23", collectionType: "Fine Art", objectType: "Watercolour", title: "Fetges", creators: ["Charles Rennie Mackintosh"], designers: [], makers: [], dateCreated: "1927", accessionNumber: "GLAHA/F/0312", location: "Hunterian Museum", hasImage: true, materials: ["Watercolour", "Paper"], associatedPeople: ["Margaret Macdonald Mackintosh"], onDisplay: true },
	{ id: "crm24", collectionType: "Decorative Art", objectType: "Metalwork", title: "Door Handle Plate, Hill House", creators: ["Charles Rennie Mackintosh"], designers: ["Charles Rennie Mackintosh"], makers: ["Kellock Brown"], dateCreated: "1903", accessionNumber: "HH/M/0007", location: "Hill House", hasImage: true, materials: ["Brass"], associatedPeople: ["Walter Blackie"], onDisplay: true },
];

const COLLECTION_TYPES: CollectionType[] = ["Architecture", "Fine Art", "Decorative Art", "Archive"];
const LOCATIONS: Location[] = ["Hill House", "Willow Tea Rooms", "Glasgow School of Art", "House for an Art Lover", "Queen's Cross Church", "Hunterian Museum"];
const CREATORS: Creator[] = ["Charles Rennie Mackintosh", "Margaret Macdonald Mackintosh", "Frances Macdonald", "Herbert MacNair", "Unknown"];
const DESIGNERS: string[] = [...new Set(ALL_ITEMS.flatMap((i) => i.designers))].sort();
const MAKERS: string[] = [...new Set(ALL_ITEMS.flatMap((i) => i.makers))].sort();
const MATERIALS: string[] = [...new Set(ALL_ITEMS.flatMap((i) => i.materials))].sort();
const ASSOCIATED_PEOPLE: string[] = [...new Set(ALL_ITEMS.flatMap((i) => i.associatedPeople))].sort();

// Date filter buckets by decade, e.g. "1890s"
function decadeOf(item: CRMItem): string {
	const year = Number.parseInt(item.dateCreated.replace(/\D/g, ""), 10);
	return `${Math.floor(year / 10) * 10}s`;
}
const DECADES: string[] = [...new Set(ALL_ITEMS.map(decadeOf))].sort();

const PAGE_SIZE = 12;

// ── Filter helpers ──────────────────────────────────────────────────────

interface Filters {
	query: string;
	date: string[];
	creator: Creator[];
	designer: string[];
	maker: string[];
	location: Location[];
	material: string[];
	category: CollectionType[];
	associatedPerson: string[];
}

function emptyFilters(): Filters {
	return { query: "", date: [], creator: [], designer: [], maker: [], location: [], material: [], category: [], associatedPerson: [] };
}

function applyFilters(items: CRMItem[], f: Filters): CRMItem[] {
	return items.filter((item) => {
		if (f.date.length > 0 && !f.date.includes(decadeOf(item))) return false;
		if (f.creator.length > 0 && !item.creators.some((c) => f.creator.includes(c))) return false;
		if (f.designer.length > 0 && !item.designers.some((d) => f.designer.includes(d))) return false;
		if (f.maker.length > 0 && !item.makers.some((m) => f.maker.includes(m))) return false;
		if (f.location.length > 0 && !f.location.includes(item.location)) return false;
		if (f.material.length > 0 && !item.materials.some((m) => f.material.includes(m))) return false;
		if (f.category.length > 0 && !f.category.includes(item.collectionType)) return false;
		if (f.associatedPerson.length > 0 && !item.associatedPeople.some((p) => f.associatedPerson.includes(p))) return false;
		if (f.query) {
			const q = f.query.toLowerCase();
			if (!item.title.toLowerCase().includes(q) && !item.creators.some((c) => c.toLowerCase().includes(q)) && !item.accessionNumber.toLowerCase().includes(q)) return false;
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
			<div className="flex flex-1 flex-col gap-1.5 border-2 border-red-500 p-3">
				<span className="inline-block self-start border border-gray-400 bg-gray-100 px-1.5 py-0.5 font-mono text-label uppercase tracking-[0.08em] text-gray-600">
					{item.objectType}
				</span>
				<h3 className="font-mono text-meta font-medium leading-snug text-gray-900">{item.title}</h3>
				<p className="font-mono text-label text-gray-500">Creator: {item.creators.join(", ")}</p>
			</div>
		</article>
	);
}

// ── Page ────────────────────────────────────────────────────────────────

type FilterKey = Exclude<keyof Filters, "query">;

// Labels for the active-filter chips, in sidebar order
const FILTER_LABELS: Record<FilterKey, string> = {
	date: "Date",
	creator: "Creator",
	designer: "Designer",
	maker: "Maker",
	location: "Location",
	material: "Material",
	category: "Category",
	associatedPerson: "Associated person",
};

type OpenAccordion = "date" | "creator" | "designer" | "maker" | "location" | "material" | "category" | "associatedPerson" | null;
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
	const activeCount = filters.date.length + filters.creator.length + filters.designer.length + filters.maker.length + filters.location.length + filters.material.length + filters.category.length + filters.associatedPerson.length;

	useEffect(() => { setPage(1); }, [filters, query, sort]);

	function goToPage(n: number) {
		setPage(n);
		resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	function setF<K extends keyof Filters>(key: K, value: Filters[K]) {
		setFilters((prev) => ({ ...prev, [key]: value }));
	}

	const activeChips = (Object.keys(FILTER_LABELS) as FilterKey[]).flatMap((key) =>
		(filters[key] as string[]).map((value) => ({ key, value })),
	);

	function removeChip(key: FilterKey, value: string) {
		setFilters((prev) => ({ ...prev, [key]: (prev[key] as string[]).filter((v) => v !== value) }));
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
						className="mx-auto flex max-w-sm border border-gray-400 focus-within:border-gray-800 hover:border-gray-600"
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

				{/* Layout */}
				<div ref={resultsRef} className="flex flex-col border-t border-gray-300 px-6 pt-8 lg:flex-row">
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
						<AccordionSection label="Date" open={open === "date"} onToggle={() => setOpen(open === "date" ? null : "date")}>
							{DECADES.map((d) => (
								<CheckOption key={d} label={d} checked={filters.date.includes(d)} onChange={() => setF("date", toggle(filters.date, d))} count={ALL_ITEMS.filter((i) => decadeOf(i) === d).length} />
							))}
						</AccordionSection>
						<AccordionSection label="Creator" open={open === "creator"} onToggle={() => setOpen(open === "creator" ? null : "creator")}>
							{CREATORS.filter((cr) => ALL_ITEMS.some((i) => i.creators.includes(cr))).map((cr) => (
								<CheckOption key={cr} label={cr} checked={filters.creator.includes(cr)} onChange={() => setF("creator", toggle(filters.creator, cr))} count={ALL_ITEMS.filter((i) => i.creators.includes(cr)).length} />
							))}
						</AccordionSection>
						<AccordionSection label="Designer" open={open === "designer"} onToggle={() => setOpen(open === "designer" ? null : "designer")}>
							{DESIGNERS.map((d) => (
								<CheckOption key={d} label={d} checked={filters.designer.includes(d)} onChange={() => setF("designer", toggle(filters.designer, d))} count={ALL_ITEMS.filter((i) => i.designers.includes(d)).length} />
							))}
						</AccordionSection>
						<AccordionSection label="Maker" open={open === "maker"} onToggle={() => setOpen(open === "maker" ? null : "maker")}>
							{MAKERS.map((m) => (
								<CheckOption key={m} label={m} checked={filters.maker.includes(m)} onChange={() => setF("maker", toggle(filters.maker, m))} count={ALL_ITEMS.filter((i) => i.makers.includes(m)).length} />
							))}
						</AccordionSection>
						<AccordionSection label="Location" open={open === "location"} onToggle={() => setOpen(open === "location" ? null : "location")}>
							{LOCATIONS.filter((loc) => ALL_ITEMS.some((i) => i.location === loc)).map((loc) => (
								<CheckOption key={loc} label={loc} checked={filters.location.includes(loc)} onChange={() => setF("location", toggle(filters.location, loc))} count={ALL_ITEMS.filter((i) => i.location === loc).length} />
							))}
						</AccordionSection>
						<AccordionSection label="Materials" open={open === "material"} onToggle={() => setOpen(open === "material" ? null : "material")}>
							{MATERIALS.map((m) => (
								<CheckOption key={m} label={m} checked={filters.material.includes(m)} onChange={() => setF("material", toggle(filters.material, m))} count={ALL_ITEMS.filter((i) => i.materials.includes(m)).length} />
							))}
						</AccordionSection>
						<AccordionSection label="Category" open={open === "category"} onToggle={() => setOpen(open === "category" ? null : "category")}>
							{COLLECTION_TYPES.map((ct) => (
								<CheckOption key={ct} label={ct} checked={filters.category.includes(ct)} onChange={() => setF("category", toggle(filters.category, ct))} count={ALL_ITEMS.filter((i) => i.collectionType === ct).length} />
							))}
						</AccordionSection>
						<AccordionSection label="Associated person" open={open === "associatedPerson"} onToggle={() => setOpen(open === "associatedPerson" ? null : "associatedPerson")}>
							{ASSOCIATED_PEOPLE.map((ap) => (
								<CheckOption key={ap} label={ap} checked={filters.associatedPerson.includes(ap)} onChange={() => setF("associatedPerson", toggle(filters.associatedPerson, ap))} count={ALL_ITEMS.filter((i) => i.associatedPeople.includes(ap)).length} />
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
					<WireframeSection label="Results grid" className="flex-1 px-6 pt-6 pb-6 lg:pt-0">
						{/* Count and sort sit level with the sidebar's "Filter by" bar (border-2 transparent + py-2.5 matches its height) */}
						<div className="mb-2 flex flex-col gap-4 border-2 border-transparent lg:flex-row lg:items-center lg:justify-between lg:py-2.5">
							<p className="font-mono text-meta text-gray-600">
								{results.length < ALL_ITEMS.length
									? `Showing ${results.length} of ${ALL_ITEMS.length} results`
									: `Showing ${ALL_ITEMS.length} results`}
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
							<div className="flex items-center gap-2 self-end lg:self-auto">
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
						{activeChips.length > 0 && (
							<ul className="mb-4 flex flex-wrap gap-2">
								{activeChips.map(({ key, value }) => (
									<li key={`${key}-${value}`} className="flex items-center gap-2 border border-gray-400 bg-gray-100 py-1 pr-1.5 pl-2.5 font-mono text-label text-gray-700">
										<span>{FILTER_LABELS[key]}: {value}</span>
										<button
											type="button"
											onClick={() => removeChip(key, value)}
											aria-label={`Remove ${FILTER_LABELS[key]}: ${value} filter`}
											className="px-1 text-gray-500 hover:text-black"
										>
											×
										</button>
									</li>
								))}
							</ul>
						)}
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
