"use client";

import { Suspense } from "react";
import {
	Container,
	ImagePlaceholder,
	WireframeSection,
} from "@/components/wireframe";
import NtsFooter from "@/components/wireframe/NtsFooter";
import NtsHeader from "@/components/wireframe/NtsHeader";
import { ScopePage } from "@/providers/ScopeProvider";

function CollectionHomeMvpContent() {
	return (
		<ScopePage id="collection-home-mvp">
			<div className="min-h-screen bg-white">
				<NtsHeader
					breadcrumb={[
						{ label: "Home" },
						{ label: "Collections", href: "/explore-collections" },
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
						<div className="mt-4 flex justify-center gap-6 font-mono text-meta text-gray-400 underline">
							<p>Show me a random object!</p>
							<p>Advanced search</p>
						</div>
					</Container>
				</WireframeSection>

				{/* Curated content placeholder — deliberately tall to reserve space for content still to be decided */}
				<WireframeSection label="Curated content" className="py-10">
					<Container size="md">
						<div className="flex h-[800px] items-center justify-center border-2 border-red-500">
							<p className="font-mono text-meta text-gray-400">Curated Content TBD</p>
						</div>
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
						{/* Funder logo */}
						<ImagePlaceholder aspect="2/1" label="[NLHF logo]" className="mx-auto mt-8 w-48" />
						<p className="mt-2 text-center font-mono text-label text-gray-400">National Lottery Heritage Fund</p>
					</Container>
				</WireframeSection>

				<NtsFooter />
			</div>
		</ScopePage>
	);
}

export default function CollectionHomeMvpPage() {
	return (
		<Suspense>
			<CollectionHomeMvpContent />
		</Suspense>
	);
}
