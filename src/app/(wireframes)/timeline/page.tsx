"use client";

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

const TIMELINE_STOPS = [
	{
		date: "1868–1877",
		info: "Early childhood in Glasgow. Family moves to Dennistoun.",
		artworks: ["[Sketch — childhood drawing]", "[Family photograph]", "[Dennistoun streetscape]"],
		align: "left",
	},
	{
		date: "1884–1893",
		info: "Studies at Glasgow School of Art. Wins travelling scholarship to Italy.",
		artworks: ["[GSA exterior study]", "[Italian sketchbook page]", "[Early watercolour]"],
		align: "right",
	},
	{
		date: "1896–1909",
		info: "Peak creative period. Glasgow School of Art building. Willow Tea Rooms.",
		artworks: ["[GSA Library interior]", "[Willow Tea Rooms chair]", "[Rose motif tile]"],
		align: "left",
	},
	{
		date: "1900–1903",
		info: "Hill House commission. International recognition at Vienna Secessionist exhibitions.",
		artworks: ["[Hill House exterior]", "[Hill House bedroom]", "[Vienna exhibition poster]"],
		align: "right",
	},
	{
		date: "1914–1928",
		info: "Moves to London then Port Vendres, France. Watercolour landscapes.",
		artworks: ["[Port Vendres landscape]", "[La Rue du Soleil]", "[Fetges watercolour]"],
		align: "left",
	},
];

function ArtworkCard({ label }: { label: string }) {
	return (
		<div className="w-36 border border-gray-300">
			<ImagePlaceholder aspect="4/3" label="" />
			<div className="px-2 py-1.5">
				<p className="font-mono text-label text-gray-500">{label}</p>
			</div>
		</div>
	);
}

function TimelineStop({
	stop,
	isLast,
}: {
	stop: (typeof TIMELINE_STOPS)[number];
	isLast: boolean;
}) {
	const isLeft = stop.align === "left";
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
			{ threshold: 0.15 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className="relative flex flex-col transition-all duration-700"
			style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
		>
			<div
				className={`flex items-start gap-6 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
			>
				{/* Date + info card */}
				<div className="w-56 shrink-0 border border-gray-400 bg-gray-50 p-4">
					<p className="font-mono text-label font-bold uppercase tracking-wide text-gray-800">
						{stop.date}
					</p>
					<p className="mt-1 font-mono text-meta text-gray-600">{stop.info}</p>
				</div>

				{/* Connector dot + dashed vertical line */}
				<div className="flex shrink-0 flex-col items-center self-stretch">
					<div className="h-4 w-4 rounded-full border-2 border-gray-500 bg-white" />
					{!isLast && (
						<div className="flex-1 border-l-2 border-dashed border-gray-300" />
					)}
				</div>

				{/* Artwork cards */}
				<div className="flex flex-wrap gap-3">
					{stop.artworks.map((art) => (
						<ArtworkCard key={art} label={art} />
					))}
				</div>
			</div>

			{/* Zigzag connector between stops */}
			{!isLast && (
				<div
					className={`my-2 h-8 border-b-2 border-dashed border-gray-300 ${
						isLeft
							? "ml-[14.5rem] mr-0 border-r-2 rounded-br-lg"
							: "mr-[14.5rem] ml-0 border-l-2 rounded-bl-lg"
					}`}
				/>
			)}
		</div>
	);
}

function TimelineContent() {
	return (
		<ScopePage id="timeline">
			<div className="min-h-screen bg-white">
				<NtsHeader
					breadcrumb={[
						{ label: "Home" },
						{ label: "Collections" },
						{ label: "Charles Rennie Mackintosh" },
						{ label: "Timeline" },
					]}
				/>

				<WireframeSection label="Page header" className="border-b border-gray-200 py-10">
					<Container>
						<SectionLabel>Mackintosh Collection</SectionLabel>
						<h1 className="mt-2 font-mono text-page font-semibold leading-tight tracking-tight">
							Life & Work: A Timeline
						</h1>
						<p className="mt-3 max-w-2xl font-mono text-body text-gray-600">
							Explore key moments in Charles Rennie Mackintosh's life alongside
							related artworks, designs and documents from the collection.
						</p>
					</Container>
				</WireframeSection>

				<WireframeSection label="Timeline" className="py-12">
					<Container size="xl">
						<div className="flex flex-col gap-48">
							{TIMELINE_STOPS.map((stop, i) => (
								<TimelineStop
									key={stop.date}
									stop={stop}
									isLast={i === TIMELINE_STOPS.length - 1}
								/>
							))}
						</div>
					</Container>
				</WireframeSection>

				<NtsFooter />
			</div>
		</ScopePage>
	);
}

export default function TimelinePage() {
	return (
		<Suspense>
			<TimelineContent />
		</Suspense>
	);
}
