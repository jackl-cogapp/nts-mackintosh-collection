"use client";

import { Suspense } from "react";
import {
	Container,
	ImagePlaceholder,
	SectionLabel,
	WireframeSection,
} from "@/components/wireframe";
import NtsFooter from "@/components/wireframe/NtsFooter";
import NtsHeader from "@/components/wireframe/NtsHeader";
import { ScopePage } from "@/providers/ScopeProvider";

const COLLECTIONS = [
	{
		id: "robert-burns",
		title: "Robert Burns Collection",
		description:
			"Museum and archive collections from Robert Burns Birthplace Museum, available for everyone to explore online.",
		tag: "2,700+ objects",
	},
	{
		id: "charles-mackintosh",
		title: "Charles Rennie Mackintosh Collection",
		description:
			"Explore the art, architecture and design of Scotland's most celebrated creative talent, from sketches to finished works.",
		tag: "1,400+ objects",
	},
];

function ExploreCollectionsContent() {
	return (
		<ScopePage id="explore-collections">
			<div className="min-h-screen bg-white">
				<NtsHeader breadcrumb={[{ label: "Home" }, { label: "Collections" }]} />

				<WireframeSection label="Page header" className="border-b border-gray-200 py-10">
					<Container>
						<SectionLabel>NTS Collections</SectionLabel>
						<h1 className="mt-2 font-mono text-page font-semibold leading-tight tracking-tight">
							Explore our Collections
						</h1>
						<p className="mt-3 max-w-2xl font-mono text-body text-gray-600">
							Museum and archive collections from across our properties are now
							available for everyone to explore online.
						</p>
					</Container>
				</WireframeSection>

				<WireframeSection label="Collection cards" className="py-12">
					<Container>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							{COLLECTIONS.map((col) => (
								<div
									key={col.id}
									className="flex flex-col border border-gray-300 transition-colors hover:border-gray-500 hover:bg-gray-50"
								>
									<ImagePlaceholder
										aspect="16/9"
										label={`[${col.title} — hero image]`}
									/>
									<div className="flex flex-1 flex-col p-6">
										<span className="mb-1 font-mono text-label uppercase tracking-[0.08em] text-gray-400">
											{col.tag}
										</span>
										<h2 className="font-mono text-section font-semibold">
											{col.title}
										</h2>
										<p className="mt-2 font-mono text-body text-gray-600">
											{col.description}
										</p>
										<div className="mt-6">
											<span className="border border-gray-800 px-4 py-2 font-mono text-label font-medium uppercase tracking-[0.08em]">
												Explore collection →
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</Container>
				</WireframeSection>

				<NtsFooter />
			</div>
		</ScopePage>
	);
}

export default function ExploreCollectionsPage() {
	return (
		<Suspense>
			<ExploreCollectionsContent />
		</Suspense>
	);
}
