/**
 * Central wireframe data layer.
 * Mackintosh Collection wireframes, extracted from the combined
 * jacks-wireframes project for standalone client hosting.
 */

// ── Review status ────────────────────────────────────────────────────

export type ReviewStatus = "wip" | "review" | "with-client" | "approved";

export const STATUS_LABELS: Record<ReviewStatus, string> = {
	wip: "WIP",
	review: "Review",
	"with-client": "With client",
	approved: "Approved",
};

export const STATUS_STYLES: Record<ReviewStatus, string> = {
	wip: "border-gray-300 text-gray-400",
	review: "border-amber-400 text-amber-600",
	"with-client": "border-blue-400 text-blue-600",
	approved: "border-green-400 text-green-600",
};

// ── Page registry ────────────────────────────────────────────────────

export interface WireframePage {
	id: string;
	title: string;
	description: string;
	status: ReviewStatus;
	group: string;
}

export const pages: WireframePage[] = [
	// ── Mackintosh Collection ────────────────────────────────────────
	{
		id: "collection-home-mvp",
		title: "Mackintosh Collection Home — MVP",
		description:
			"Collection homepage with hero, search widget, theme bubble explorer, and iconic works strip",
		status: "wip",
		group: "Mackintosh Collection",
	},
	{
		id: "crm-item",
		title: "Mackintosh Collection Item",
		description:
			"Collection object detail page — image viewer, key details sidebar, description, and object information",
		status: "wip",
		group: "Mackintosh Collection",
	},
	{
		id: "crm-search",
		title: "Mackintosh Collection Search",
		description:
			"Charles Rennie Mackintosh collection search page with faceted sidebar filters and card grid",
		status: "wip",
		group: "Mackintosh Collection",
	},
	{
		id: "explore-collections",
		title: "Burns/Mackintosh Picker",
		description:
			"Landing page listing NTS online collections — entry point for Robert Burns and Mackintosh",
		status: "wip",
		group: "Mackintosh Collection",
	},
	{
		id: "collection-home",
		title: "Mackintosh Collection Home — Not MVP",
		description:
			"Collection homepage with hero, search widget, theme bubble explorer, and iconic works strip",
		status: "wip",
		group: "Mackintosh Collection",
	},
	{
		id: "timeline",
		title: "Mackintosh Timeline",
		description:
			"Zigzag life-and-work timeline pairing dated biographical stops with related artworks",
		status: "wip",
		group: "Mackintosh Collection",
	},
	{
		id: "map",
		title: "Mackintosh Map Explorer",
		description:
			"Interactive map of Mackintosh locations across Scotland/UK and Europe with clickable pins",
		status: "wip",
		group: "Mackintosh Collection",
	},

	// ── Templates ──────────────────────────────────────────────────────
	{
		id: "sitemap",
		title: "Site Map",
		description: "Information architecture, page hierarchy and navigation structure",
		status: "wip",
		group: "Templates",
	},
];

export const PAGE_GROUPS = ["Mackintosh Collection", "Templates"] as const;

// ── Navigation tree ──────────────────────────────────────────────────

export interface NavNode {
	label: string;
	href: string;
	children?: NavNode[];
}

export const navigation: NavNode[] = [
	{ label: "Home", href: "/" },
	{
		label: "Mackintosh",
		href: "",
		children: [
			{ label: "Explore Collections", href: "/explore-collections" },
			{ label: "Collection Home — Not MVP", href: "/collection-home" },
			{ label: "Collection Home — MVP", href: "/collection-home-mvp" },
			{ label: "Timeline", href: "/timeline" },
			{ label: "Map Explorer", href: "/map" },
			{ label: "Collection Item", href: "/crm-item" },
			{ label: "Collection Search", href: "/crm-search" },
		],
	},
	{ label: "Site Map", href: "/sitemap" },
];

// ── Footer link groups ───────────────────────────────────────────────

export interface FooterGroup {
	heading: string;
	links: { label: string; href: string }[];
}

export const footerGroups: FooterGroup[] = PAGE_GROUPS.map((group) => ({
	heading: group,
	links: pages
		.filter((p) => p.group === group)
		.map((p) => ({ label: p.title, href: `/${p.id}` })),
}));
