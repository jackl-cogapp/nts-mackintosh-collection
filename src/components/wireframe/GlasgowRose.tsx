"use client";

import { useState } from "react";

const SECTIONS = [
	{
		id: "architecture",
		label: "Architecture",
		count: "340 items",
		desc: "Buildings, plans and architectural drawings",
		tagline: "Discover the buildings and spaces that defined a generation",
		angle: 0,
	},
	{
		id: "design",
		label: "Design",
		count: "280 items",
		desc: "Furniture, interiors and decorative objects",
		tagline: "Learn about the different designs and styles Mackintosh produced",
		angle: 60,
	},
	{
		id: "painting",
		label: "Painting",
		count: "210 items",
		desc: "Watercolours, oils and sketches",
		tagline: "Explore Mackintosh's watercolours, sketches and graphic works",
		angle: 120,
	},
	{
		id: "nature",
		label: "Nature",
		count: "95 items",
		desc: "Botanical studies and natural forms",
		tagline: "See how the natural world shaped Mackintosh's organic forms",
		angle: 180,
	},
	{
		id: "glasgow-style",
		label: "Glasgow Style",
		count: "185 items",
		desc: "Collaborative works with the Glasgow Four",
		tagline: "The collaborative movement that shaped an Art Nouveau city",
		angle: 240,
	},
	{
		id: "legacy",
		label: "Legacy",
		count: "120 items",
		desc: "Influence, reception and cultural legacy",
		tagline: "How Mackintosh's work continues to influence art and design today",
		angle: 300,
	},
];

// Outer petal — rounded rose petal shape, tip pointing up at (0,−114).
// Base follows the inner circle (r=42) from 240° to 300°.
// Wide, organic curves — not pointed like a daisy.
const OUTER_PETAL =
	"M -42 -72.8 C -124 -96, -130 -184, 0 -228 C 130 -184, 124 -96, 42 -72.8 A 84 84 0 0 0 -42 -72.8 Z";

const INNER_PETAL =
	"M -24 -41.6 C -70 -60, -72 -104, 0 -130 C 72 -104, 70 -60, 24 -41.6 A 48 48 0 0 0 -24 -41.6 Z";

const CX = 400;
const CY = 400;
const LABEL_R = 265;

export default function GlasgowRose() {
	const [active, setActive] = useState<string | null>(null);
	const activeSection = SECTIONS.find((s) => s.id === active);

	return (
		<div className="flex flex-col items-center gap-6">
			<svg
				viewBox="0 0 800 800"
				className="w-full max-w-2xl"
				aria-label="Glasgow Rose — explore the collection by theme"
			>
				{/* ── Outer rose petals (clickable shards) ─────────────────────── */}
				{SECTIONS.map((section) => {
					const isActive = active === section.id;
					return (
						<g
							key={section.id}
							transform={`translate(${CX},${CY}) rotate(${section.angle})`}
							style={{ cursor: "pointer" }}
							onMouseEnter={() => setActive(section.id)}
							onMouseLeave={() => setActive(null)}
							onClick={() => setActive(section.id)}
						>
							<path
								d={OUTER_PETAL}
								fill={isActive ? "#374151" : "#f1f5f9"}
								stroke={isActive ? "#111827" : "#94a3b8"}
								strokeWidth={isActive ? 1.8 : 1.2}
								style={{ transition: "fill 0.15s, stroke 0.15s" }}
							/>
						</g>
					);
				})}

				{/* ── Inner decorative petals (non-interactive) ────────────────
				    A second, smaller ring of petals rotated 30° from the outer
				    ring — this creates the layered, multi-ring quality of the
				    real Glasgow Rose. */}
				{SECTIONS.map((section) => (
					<g
						key={`inner-${section.id}`}
						transform={`translate(${CX},${CY}) rotate(${section.angle + 30})`}
					>
						<path
							d={INNER_PETAL}
							fill="#e2e8f0"
							stroke="#cbd5e1"
							strokeWidth={1}
						/>
					</g>
				))}

				{/* ── Centre bud ───────────────────────────────────────────────
				    Concentric rings representing the tightly-furled centre of
				    the rose bloom. */}
				<circle cx={CX} cy={CY} r={84} fill="white" stroke="#94a3b8" strokeWidth={1.5} />
				<circle cx={CX} cy={CY} r={60} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
				<circle cx={CX} cy={CY} r={38} fill="white" stroke="#cbd5e1" strokeWidth={1} />
				<circle cx={CX} cy={CY} r={20} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1} />
				<circle cx={CX} cy={CY} r={8} fill="#94a3b8" />

				{/* ── Labels ───────────────────────────────────────────────────── */}
				{SECTIONS.map((section) => {
					const isActive = active === section.id;
					const rad = (section.angle * Math.PI) / 180;
					const lx = CX + LABEL_R * Math.sin(rad);
					const ly = CY - LABEL_R * Math.cos(rad);
					const anchor =
						lx < CX - 12 ? "end" : lx > CX + 12 ? "start" : "middle";

					return (
						<text
							key={section.id}
							x={lx}
							y={ly}
							textAnchor={anchor}
							dominantBaseline="middle"
							fontSize={isActive ? "18" : "13"}
							fontFamily="monospace"
							fontWeight={isActive ? "bold" : "normal"}
							fill={isActive ? "#111827" : "#94a3b8"}
							style={{
								cursor: "pointer",
								userSelect: "none",
								transition: "fill 0.15s",
							}}
							onMouseEnter={() => setActive(section.id)}
							onMouseLeave={() => setActive(null)}
						>
							{section.label}
						</text>
					);
				})}
			</svg>

			{/* Info panel */}
			<div
				className="w-full max-w-2xl border border-gray-300 p-4"
				style={{ minHeight: "90px" }}
			>
				{activeSection ? (
					<div>
						<div className="flex items-baseline justify-between">
							<p className="font-mono text-card font-semibold text-gray-900">
								{activeSection.label}
							</p>
							<span className="font-mono text-label text-gray-400">
								{activeSection.count}
							</span>
						</div>
						<p className="mt-1 font-mono text-meta text-gray-500">
							{activeSection.desc}
						</p>
						<p className="mt-3 cursor-pointer font-mono text-label uppercase tracking-[0.08em] text-gray-700 underline">
							Browse {activeSection.label} →
						</p>
					</div>
				) : (
					<p className="font-mono text-meta text-gray-400">
						Select a petal to explore the collection by theme
					</p>
				)}
			</div>
		</div>
	);
}
