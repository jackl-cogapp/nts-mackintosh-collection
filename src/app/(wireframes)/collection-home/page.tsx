"use client";

import { Suspense, useState } from "react";
import {
	Container,
	ImagePlaceholder,
	SectionLabel,
	WireframeSection,
} from "@/components/wireframe";
import GlasgowRose from "@/components/wireframe/GlasgowRose";
import NtsFooter from "@/components/wireframe/NtsFooter";
import NtsHeader from "@/components/wireframe/NtsHeader";
import { ScopePage } from "@/providers/ScopeProvider";

const FILTERS = ["All", "Architecture", "Design", "Art", "Glasswork", "Furniture"] as const;
type Filter = (typeof FILTERS)[number];

const ICONIC_WORKS: { title: string; meta: string; category: Filter }[] = [
	{ title: "Glasgow School of Art", meta: "Architecture, 1897–1909", category: "Architecture" },
	{ title: "Hill House", meta: "Architecture, 1902–1904", category: "Architecture" },
	{ title: "Willow Tea Rooms", meta: "Architecture, 1903", category: "Architecture" },
	{ title: "The Wassail", meta: "Art, 1900", category: "Art" },
	{ title: "Rose Motif", meta: "Art, 1902", category: "Art" },
	{ title: "Part Seen, Part Imagined", meta: "Art, 1896", category: "Art" },
	{ title: "Highback Chair", meta: "Furniture, 1897", category: "Furniture" },
	{ title: "The Oval Table", meta: "Furniture, 1903", category: "Furniture" },
	{ title: "Writing Desk", meta: "Furniture, 1904", category: "Furniture" },
	{ title: "Rose Window, Hill House", meta: "Glasswork, 1904", category: "Glasswork" },
	{ title: "Willow Tea Rooms Door Panel", meta: "Glasswork, 1903", category: "Glasswork" },
	{ title: "Cabinet with Mirror Panels", meta: "Design, 1902", category: "Design" },
	{ title: "Textile Pattern — Stylised Tulip", meta: "Design, 1915", category: "Design" },
];

function CollectionHomeContent() {
	const [activeFilter, setActiveFilter] = useState<Filter>("All");
	const [showAll, setShowAll] = useState(false);
	const filtered = activeFilter === "All" ? ICONIC_WORKS : ICONIC_WORKS.filter(w => w.category === activeFilter);
	const visible = filtered.slice(0, 5);
	return (
		<ScopePage id="collection-home">
			<div className="min-h-screen bg-white">
				<NtsHeader
					breadcrumb={[
						{ label: "Home" },
						{ label: "Collections" },
						{ label: "Charles Rennie Mackintosh" },
					]}
				/>

				{/* Hero */}
				<WireframeSection label="Hero" className="relative">
					<div className="relative">
						<ImagePlaceholder aspect="4/1" label="" />
						<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-8 text-center text-white">
							<p className="font-mono text-label uppercase tracking-[0.12em] text-white/80">
								NTS Collections
							</p>
							<h1 className="mt-2 font-mono text-page font-semibold leading-tight tracking-tight">
								Charles Rennie Mackintosh
							</h1>
							<p className="mt-2 font-mono text-body text-white/80">
								Explore the art, architecture and design of Scotland's most
								celebrated creative talent.
							</p>
						</div>
					</div>
				</WireframeSection>

				{/* Search */}
				<WireframeSection
					label="Collections search"
					className="border-b-2 border-t-2 border-gray-200 bg-white py-10"
				>
					<Container size="md">
						<p className="mb-1 text-center font-mono text-body font-medium text-gray-700">
							We look after over 1,400 objects in the Mackintosh Collection.
						</p>
						<p className="mb-5 text-center font-mono text-meta text-gray-500">
							Search by name, object type or accession number
						</p>
						<div className="flex items-center border border-gray-400 bg-white">
							<input
								type="text"
								placeholder="Search the collection..."
								className="flex-1 bg-transparent px-4 py-3 font-mono text-body text-gray-600 placeholder-gray-400 outline-none"
								readOnly
							/>
							<div className="flex h-full items-center border-l border-gray-300 px-4">
								<span className="font-mono text-body text-gray-500">⌕</span>
							</div>
						</div>
						<p className="mt-2 text-center font-mono text-meta text-gray-400 underline">
							Advanced search
						</p>
					</Container>
				</WireframeSection>

				{/* Glasgow Rose — interactive theme navigator */}
				<WireframeSection
					label="Explore by theme"
					className="border-b border-gray-200 py-12"
				>
					<Container size="md">
						<SectionLabel className="mb-2">Explore the Collection</SectionLabel>
						<p className="mb-8 font-mono text-meta text-gray-500">
							Select a petal of the Glasgow Rose to explore works by theme
						</p>
						<GlasgowRose />
					</Container>
				</WireframeSection>

				{/* Timeline promo banner — flipped: image left, text right */}
				<WireframeSection label="Timeline banner" className="border-b border-gray-200 py-10">
					<Container>
					<a href="/timeline" className="group block overflow-hidden">
						<div className="flex min-h-[260px] w-full">
							{/* Left — image placeholder, extends 40px under the text panel */}
							<div className="relative bg-gray-200" style={{ flex: 1, marginRight: "-40px" }}>
								<div className="absolute inset-0 flex items-center justify-center">
									<span className="font-mono text-meta text-gray-400">
										[Timeline or portrait photograph]
									</span>
								</div>
							</div>
							{/* Right — text panel, diagonal cut on the left edge via clip-path */}
							<div
								className="relative z-10 flex w-1/2 flex-col items-end justify-center border border-gray-300 bg-white px-12 py-12 text-right"
								style={{ clipPath: "polygon(40px 0, 100% 0, 100% 100%, 0 100%)" }}
							>
								<h2 className="font-mono text-section font-semibold uppercase leading-tight tracking-tight text-gray-900">
									Mackintosh's Life & Work
								</h2>
								<p className="mt-3 font-mono text-meta text-gray-500">
									Follow the story of Mackintosh's life through key moments,
									places and the artworks connected to each chapter.
								</p>
								<div className="mt-6 self-end border border-gray-800 px-5 py-2">
									<span className="font-mono text-label font-medium uppercase tracking-[0.08em] text-gray-900">
										Explore the timeline →
									</span>
								</div>
							</div>
						</div>
					</a>
				</Container>
				</WireframeSection>

				{/* Iconic works */}
				<WireframeSection label="Explore iconic works" className="border-b border-gray-200 py-16">
					<Container size="xl">
						<SectionLabel className="mb-4">Explore Iconic Works</SectionLabel>
						{/* Filter facets — horizontal row */}
						<div className="mb-6 flex items-center gap-2">
							{FILTERS.map((f) => (
								<button
									key={f}
									type="button"
									onClick={() => { setActiveFilter(f); setShowAll(false); }}
									className={`border px-3 py-1.5 font-mono text-label uppercase tracking-[0.08em] transition-colors ${
										activeFilter === f
											? "border-gray-800 bg-gray-800 text-white"
											: "border-gray-300 text-gray-500 hover:border-gray-500 hover:text-gray-800"
									}`}
								>
									{f}
								</button>
							))}
						</div>
						{/* Artwork cards */}
						<div className="grid grid-cols-5 gap-3">
							{visible.map((work) => (
								<div
									key={work.title}
									className="flex flex-col border border-gray-300 hover:border-gray-500"
								>
									<ImagePlaceholder aspect="4/3" label="[Artwork]" />
									<div className="p-2">
										<p className="font-mono text-label font-medium text-gray-700">
											{work.title}
										</p>
										<p className="mt-0.5 font-mono text-label text-gray-400">
											{work.meta}
										</p>
									</div>
								</div>
							))}
						</div>
						<a
							href="/collection-search"
							className="mt-4 inline-block border border-gray-400 px-4 py-2 font-mono text-label uppercase tracking-[0.08em] text-gray-600 hover:border-gray-700 hover:text-gray-900"
						>
							See more →
						</a>
					</Container>
				</WireframeSection>

				{/* Global influence promo banner */}
				<WireframeSection label="Global influence banner" className="py-10">
					<Container>
					<a href="/map" className="group block overflow-hidden">
						<div className="flex min-h-[260px] w-full">
							{/* Left — coloured panel, diagonal cut on the right edge via clip-path */}
							<div
								className="relative z-10 flex w-1/2 flex-col justify-center border border-gray-300 bg-white px-10 py-12"
								style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)" }}
							>
								<h2 className="font-mono text-section font-semibold uppercase leading-tight tracking-tight text-gray-900">
									Mackintosh's Global Influence
								</h2>
								<p className="mt-3 font-mono text-meta text-gray-500">
									Discover where Mackintosh lived, worked and exhibited — from
									Glasgow to Vienna, Turin and beyond.
								</p>
								<div className="mt-6 self-start border border-gray-800 px-5 py-2">
									<span className="font-mono text-label font-medium uppercase tracking-[0.08em] text-gray-900">
										Explore the map →
									</span>
								</div>
							</div>
							{/* Right — image placeholder, extends 40px under the text panel */}
							<div className="relative bg-gray-200" style={{ flex: 1, marginLeft: "-40px" }}>
								<div className="absolute inset-0 flex items-center justify-center">
									<span className="font-mono text-meta text-gray-400">
										[Map or location photograph]
									</span>
								</div>
							</div>
						</div>
					</a>
					</Container>
				</WireframeSection>

				<div style={{ height: "64px" }} />

				{/* Acknowledgements */}
				<WireframeSection label="Acknowledgements" className="border-t border-gray-200 py-12">
					<Container size="md">
						<h2 className="mb-4 font-mono text-section font-semibold text-gray-900">
							Acknowledgements
						</h2>
						<p className="mb-3 font-mono text-body text-gray-600">
							We were able to bring the Charles Rennie Mackintosh Collection to
							life thanks to the support of our members and donors, whose
							generosity was generously matched by donations from the National
							Trust for Scotland Foundation USA.
						</p>
						<p className="font-mono text-body text-gray-600">
							We hope that this project paves the way for us to develop further
							online collections as part of our strategy to make Scotland's
							important cultural heritage accessible to everyone — both now and
							in the future. Some items in the collection were donated on behalf
							of the Friends of the Hunterian Museum in 2019.
						</p>
					</Container>
				</WireframeSection>

				<NtsFooter />
			</div>
		</ScopePage>
	);
}

export default function CollectionHomePage() {
	return (
		<Suspense>
			<CollectionHomeContent />
		</Suspense>
	);
}
