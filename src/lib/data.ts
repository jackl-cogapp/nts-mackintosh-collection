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
	// ── MVP ────────────────────────────────────────────────────────────
	{
		id: "collection-home-mvp",
		title: "Mackintosh Landing Page",
		description:
			"Collection homepage with hero, search widget, theme bubble explorer, and iconic works strip",
		status: "wip",
		group: "MVP",
	},
	{
		id: "crm-item",
		title: "Mackintosh Object Page",
		description:
			"Collection object detail page — image viewer, key details sidebar, description, and object information",
		status: "wip",
		group: "MVP",
	},
	{
		id: "crm-search",
		title: "Mackintosh Collection Search",
		description:
			"Charles Rennie Mackintosh collection search page with faceted sidebar filters and card grid",
		status: "wip",
		group: "MVP",
	},

	// ── Post-MVP ───────────────────────────────────────────────────────
	{
		id: "object-embeds",
		title: "Embeddable Object Components",
		description:
			"Embeddable collection object components in small, medium, large and card sizes, with zoomable images",
		status: "wip",
		group: "Post-MVP",
	},

	{
		id: "browse-by",
		title: "Browse By",
		description:
			"Landing page with a row of Browse by image cards under the search box, each linking to a canned search",
		status: "wip",
		group: "Post-MVP",
	},

	{
		id: "search-ui-tweaks-masonry",
		title: "UI Tweaks + Masonry",
		description:
			"Collection search with the proposed UI tweaks (filters, count/sort row, filter chips, card fields) and a masonry results grid",
		status: "wip",
		group: "Post-MVP",
	},

	{
		id: "onward-journeys",
		title: "Onward Journeys",
		description: "Object page for exploring onward journeys, currently a copy of the Object Page",
		status: "wip",
		group: "Post-MVP",
	},
	{
		id: "location-link",
		title: "Location link",
		description: "Object page for linking an object to its location, currently a copy of the Object Page",
		status: "wip",
		group: "Post-MVP",
	},

	// ── Ideas ──────────────────────────────────────────────────────────
	{
		id: "collection-home",
		title: "Mackintosh Landing — Rose Concept",
		description:
			"Collection homepage with hero, search widget, theme bubble explorer, and iconic works strip",
		status: "wip",
		group: "Ideas",
	},
	{
		id: "timeline",
		title: "Mackintosh Timeline",
		description:
			"Zigzag life-and-work timeline pairing dated biographical stops with related artworks",
		status: "wip",
		group: "Ideas",
	},
	{
		id: "map",
		title: "Mackintosh Map Explorer",
		description:
			"Interactive map of Mackintosh locations across Scotland/UK and Europe with clickable pins",
		status: "wip",
		group: "Ideas",
	},
	{
		id: "interior-photos",
		title: "Interior Photos",
		description:
			"Object page with a zoomable interior room photo, in sidebar, full width and More details variations",
		status: "wip",
		group: "Ideas",
	},
	{
		id: "object-page-tombstone",
		title: "Object Page — Tombstone",
		description:
			"Object page with image viewer and description beside stacked key details and object information tombstones",
		status: "wip",
		group: "Ideas",
	},
];

export const PAGE_GROUPS = ["MVP", "Post-MVP", "Ideas"] as const;

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
			{ label: "Landing — Rose Concept", href: "/collection-home" },
			{ label: "Landing Page", href: "/collection-home-mvp" },
			{ label: "Timeline", href: "/timeline" },
			{ label: "Map Explorer", href: "/map" },
			{ label: "Object Page", href: "/crm-item" },
			{ label: "Onward Journeys", href: "/onward-journeys" },
			{ label: "Location link", href: "/location-link" },
			{ label: "Collection Search", href: "/crm-search" },
			{ label: "UI Tweaks + Masonry", href: "/search-ui-tweaks-masonry" },
			{ label: "Browse By", href: "/browse-by" },
			{ label: "Embeddable Object Components", href: "/object-embeds" },
			{ label: "Interior Photos", href: "/interior-photos" },
			{ label: "Object Page — Tombstone", href: "/object-page-tombstone" },
		],
	},
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
