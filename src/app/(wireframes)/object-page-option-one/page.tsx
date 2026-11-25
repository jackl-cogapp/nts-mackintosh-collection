"use client";

import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { ScopePage } from "@/providers/ScopeProvider";
import { brandSans } from "./fonts";
import ImageViewer, { type ViewerImage } from "./ImageViewer";

// Hi-fi working build of "Option One object detail page" (PDF design, Nov 2026)

// ── Content ─────────────────────────────────────────────────────────────

const IMAGES: ViewerImage[] = [
	{
		src: "/object-page-option-one/image-1.jpg",
		alt: "Open manuscript volume showing two pages of handwritten verse and prose",
		transcript: [
			"From thy lov'd friends where first thy breath",
			"Was taught by Heaven to flow,",
			"Far, far remov'd, the ruthless stroke",
			"Surpris'd and laid thee low.",
			"",
			"At the last limits of our Isle,",
			"Wash'd by the western wave,",
			"Touch'd by thy fate, a thoughtful bard",
			"Sits lonely on thy grave.",
			"",
			"Ellisland 14th June 1788 — Sunday —",
			"This is now the third day I have been in this country. — “Lord what is man!” what a bustling little bundle of passions, appetites, ideas & fancies! and what a capricious kind of existence he has here!",
		],
	},
	{
		src: "/object-page-option-one/image-2.jpg",
		alt: "Detail of the right-hand page of the manuscript",
		transcript: [
			"His grief-worn heart with truest joy",
			"Shall meet the welcome shock;",
			"His airy harp shall lie unstrung,",
			"And silent on the rock.",
			"",
			"O my dear maid, my Stella, when",
			"Shall this sick period close;",
			"And lead thy solitary Bard",
			"To his belov'd repose.",
		],
	},
];

const DESCRIPTION =
	"A standard lamp made from sycamore and fruitwood which was designed by Charles Rennie Mackintosh and made by John Craig. The lamp has a rectangular top enclosing a silvered reservoir and is inlaid with rectangular panels of mother-of-pearl. The lamp is supported by four square columns which are joined by stretchers repeating the motif.";
const DESCRIPTION_MORE = [
	"The lamp formed part of the furnishing scheme Mackintosh produced for Walter Blackie at The Hill House, where furniture, fittings and decoration were designed together as a single whole.",
	"The square motif seen in the inlaid panels and stretchers recurs throughout the house, from the chair backs to the stencilled walls, tying the object closely to the rooms it was made for.",
];

const RELATED = [
	{ type: "Story", title: "Pinks", date: "1915" },
	{ type: "Architectural drawing", title: "Hill House, Ground Floor Plan", date: "1902" },
	{ type: "Furniture", title: "Ladder-back Chair", date: "1903" },
	{ type: "Architectural drawing", title: "Glasgow School of Art, North Elevation", date: "1897" },
];

const NAV = ["Visit", "What we do", "Support us", "Stories", "Shop"];

const FOOTER_COLS = [
	{ heading: "Holidays & venue hire", links: ["Holiday accommodation", "Venue hire", "Weddings", "Travel trade", "Lettings"] },
	{ heading: "About the Trust", links: ["Our work", "Our people", "Careers at the Trust", "Schools", "Stay in touch"] },
	{ heading: "Get in touch", links: ["Contact us", "FAQ", "Media centre", "Filming & photoshoots", "Shop FAQ"] },
];

const THEME = {
	"--nts-bg": "#F4F4F0",
	"--nts-pink": "#C4177C",
	"--nts-plum": "#6B1D5C",
	"--nts-teal": "#417F79",
	"--nts-yellow": "#F6E05A",
	"--nts-ink": "#111111",
	"--nts-footer": "#262626",
} as CSSProperties;

// ── Small pieces ────────────────────────────────────────────────────────

function Lnk({ children, href = "#" }: { children: ReactNode; href?: string }) {
	return (
		<a
			href={href}
			onClick={(e) => href === "#" && e.preventDefault()}
			className="underline decoration-[var(--nts-pink)] decoration-2 underline-offset-[5px] transition-colors hover:text-[var(--nts-pink)]"
		>
			{children}
		</a>
	);
}

function Logo({ inverse = false }: { inverse?: boolean }) {
	const c = inverse ? "#fff" : "var(--nts-teal)";
	return (
		<a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2" aria-label="National Trust for Scotland home">
			<svg viewBox="0 0 44 48" className="h-[46px] w-[42px]" aria-hidden="true">
				<path d="M2 2h8v6h6V2h12v6h6V2h8v20c0 14-9 22-20 24C11 44 2 36 2 22Z" fill={c} />
				<circle cx="22" cy="28" r="11" fill={inverse ? "var(--nts-footer)" : "#fff"} />
				<path d="M13.5 21.5 30.5 34.5M30.5 21.5 13.5 34.5" stroke={c} strokeWidth="4" />
			</svg>
			<span className="text-[15px] font-bold uppercase leading-[1.13] tracking-[0.02em]" style={{ color: c }}>
				National
				<br />
				Trust <span className="font-serif text-[16px] font-medium italic normal-case">for</span>
				<br />
				Scotland
			</span>
		</a>
	);
}

/** Painterly brush edge. `fill` is the colour of the band whose edge this is. */
function BrushEdge({ fill, streak, flip = false, seed = 1, className = "" }: { fill: string; streak: string; flip?: boolean; seed?: number; className?: string }) {
	let s = seed;
	const rnd = () => {
		s = (s * 9301 + 49297) % 233280;
		return s / 233280;
	};
	const pts: string[] = [];
	for (let x = 0; x <= 1440; x += 12) pts.push(`${x},${(18 + rnd() * 10 - (x % 240 < 12 ? 6 : 0)).toFixed(1)}`);
	const streaks = Array.from({ length: 9 }, () => {
		const x = rnd() * 1400;
		const w = 30 + rnd() * 260;
		const y = 6 + rnd() * 22;
		return { x, w, y, h: 1 + rnd() * 2.5 };
	});
	return (
		<svg viewBox="0 0 1440 40" preserveAspectRatio="none" className={`block h-[40px] w-full ${className}`} style={flip ? { transform: "scaleY(-1)" } : undefined} aria-hidden="true">
			<polygon points={`0,40 ${pts.join(" ")} 1440,40`} fill={fill} />
			{streaks.map((st, i) => (
				<rect key={i} x={st.x} y={st.y} width={st.w} height={st.h} rx={st.h / 2} fill={streak} />
			))}
		</svg>
	);
}

function Chevron({ dir }: { dir: "left" | "right" }) {
	return (
		<svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
			<circle cx="10" cy="10" r="10" fill="var(--nts-pink)" />
			<path d={dir === "left" ? "M11.5 6 7.5 10l4 4" : "M8.5 6l4 4-4 4"} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function Field({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div>
			<h3 className="text-[20px] font-semibold leading-tight text-[var(--nts-ink)]">{label}</h3>
			<div className="mt-2 text-[15px] leading-[1.6]">{children}</div>
		</div>
	);
}

function Stack({ children }: { children: ReactNode }) {
	return <div className="flex flex-col items-start gap-[6px]">{children}</div>;
}

// ── Header ──────────────────────────────────────────────────────────────

function Header() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	return (
		<header className="relative z-20 bg-white shadow-[0_6px_14px_-10px_rgba(0,0,0,0.25)]">
			<div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-[80px] lg:h-[112px]">
				<div className="flex items-center gap-[80px]">
					<Logo />
					<nav className="hidden items-center gap-8 xl:flex" aria-label="Main">
						{NAV.map((n) => (
							<a key={n} href="#" onClick={(e) => e.preventDefault()} className="text-[15px] font-medium uppercase tracking-[0.18em] text-gray-700 transition-colors hover:text-[var(--nts-pink)]">
								{n}
							</a>
						))}
					</nav>
				</div>
				<div className="flex items-center gap-3 sm:gap-4">
					<button type="button" onClick={() => setSearchOpen((o) => !o)} className="flex items-center gap-2 text-[16px] text-gray-700 hover:text-[var(--nts-pink)]" aria-expanded={searchOpen}>
						<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" strokeLinecap="round" /></svg>
						<span className="hidden sm:inline">Search</span>
					</button>
					<span className="hidden h-6 w-px bg-gray-300 sm:block" />
					<a href="#" onClick={(e) => e.preventDefault()} className="hidden items-center gap-2 text-[16px] text-gray-700 hover:text-[var(--nts-pink)] sm:flex">
						<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6Z" /></svg>
						My Trust
					</a>
					<a href="#" onClick={(e) => e.preventDefault()} className="ml-1 hidden bg-[var(--nts-yellow)] px-[35px] py-[14px] text-[15px] font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-[#ecd23a] sm:block">
						Join now
					</a>
					<button type="button" className="xl:hidden" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" aria-expanded={menuOpen}>
						<svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
							{menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
						</svg>
					</button>
				</div>
			</div>
			{searchOpen && (
				<div className="border-t border-gray-200 bg-white px-4 py-5 sm:px-[80px]">
					<form className="mx-auto flex max-w-[1280px] gap-3" onSubmit={(e) => e.preventDefault()}>
						{/* biome-ignore lint/a11y/noAutofocus: opened by the user */}
						<input autoFocus placeholder="Search places, stories and collections" className="flex-1 border border-gray-400 px-4 py-3 text-[16px] outline-none focus:border-[var(--nts-pink)]" />
						<button type="submit" className="bg-[var(--nts-yellow)] px-6 text-[15px] font-bold uppercase tracking-[0.14em]">Search</button>
					</form>
				</div>
			)}
			{menuOpen && (
				<nav className="flex flex-col border-t border-gray-200 bg-white px-4 py-2 sm:px-[80px] xl:hidden" aria-label="Main mobile">
					{NAV.map((n) => (
						<a key={n} href="#" onClick={(e) => e.preventDefault()} className="border-b border-gray-100 py-3 text-[15px] font-medium uppercase tracking-[0.18em]">{n}</a>
					))}
					<a href="#" onClick={(e) => e.preventDefault()} className="my-3 self-start bg-[var(--nts-yellow)] px-6 py-3 text-[15px] font-bold uppercase tracking-[0.14em] sm:hidden">Join now</a>
				</nav>
			)}
		</header>
	);
}

// ── Footer ──────────────────────────────────────────────────────────────

function SocialIcon({ name }: { name: "instagram" | "facebook" | "youtube" }) {
	return (
		<a href="#" onClick={(e) => e.preventDefault()} aria-label={name} className="text-white transition-opacity hover:opacity-70">
			{name === "instagram" && (
				<svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg>
			)}
			{name === "facebook" && (
				<svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8.2h2.8l.4-3.3h-3.2V8.4c0-.9.3-1.6 1.6-1.6h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.3h2.8V22Z" /></svg>
			)}
			{name === "youtube" && (
				<svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="currentColor" aria-hidden="true"><path d="M22 7.6a2.8 2.8 0 0 0-2-2C18.3 5.1 12 5.1 12 5.1s-6.3 0-8 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.6 12a29 29 0 0 0 .4 4.4 2.8 2.8 0 0 0 2 2c1.7.5 8 .5 8 .5s6.3 0 8-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .4-4.4 29 29 0 0 0-.4-4.4ZM9.9 15.1V8.9l5.3 3.1Z" /></svg>
			)}
		</a>
	);
}

function Footer() {
	return (
		<footer className="bg-[var(--nts-footer)] text-white">
			<div className="mx-auto max-w-[1440px] px-4 pb-10 pt-14 sm:px-[80px]">
				<div className="grid gap-10 lg:grid-cols-[auto_1fr]">
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-x-[55px] lg:border-r lg:border-white/40 lg:pr-[34px]">
						{FOOTER_COLS.map((col) => (
							<div key={col.heading}>
								<h4 className="text-[12.5px] font-bold uppercase tracking-[0.14em]">{col.heading}</h4>
								<ul className="mt-5 flex flex-col gap-[10px]">
									{col.links.map((l) => (
										<li key={l}>
											<a href="#" onClick={(e) => e.preventDefault()} className="text-[13px] tracking-[0.06em] text-white/90 hover:underline">{l}</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
					<div>
						<h3 className="text-[32px] font-semibold leading-none">Donate</h3>
						<p className="mt-4 max-w-[370px] text-[16px] leading-[1.55] text-white/90">Help protect our treasured places – now and for future generations</p>
						<a href="#" onClick={(e) => e.preventDefault()} className="mt-5 inline-flex items-center gap-6 bg-[var(--nts-yellow)] px-10 py-[14px] text-[15px] font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-[#ecd23a]">
							Donation <span aria-hidden="true">→</span>
						</a>
					</div>
				</div>

				<div className="mt-9 grid gap-8 border-t border-white/30 pt-9 lg:grid-cols-[330px_1fr_auto]">
					<div className="lg:border-r lg:border-white/40">
						<Logo inverse />
						<div className="mt-7 flex gap-7 pl-2">
							<SocialIcon name="instagram" />
							<SocialIcon name="facebook" />
							<SocialIcon name="youtube" />
						</div>
					</div>
					<div className="space-y-3 text-[12.5px] leading-[1.45] tracking-[0.06em] text-white/90 lg:px-[105px]">
						<p>The National Trust for Scotland is a charity registered in Scotland, Charity Number SC007410</p>
						<p>Registered address: Broadstone, 50 South Gyle Crescent, Edinburgh EH12 9LD</p>
					</div>
					<ul className="flex flex-col gap-1 text-[12.5px] tracking-[0.06em] lg:border-l lg:border-white/40 lg:pl-8 lg:pr-[60px]">
						{["Terms & conditions", "Privacy & data protection", "Cookies", "Accessibility", "Sitemap"].map((l) => (
							<li key={l}><a href="#" onClick={(e) => e.preventDefault()} className="underline underline-offset-2 hover:opacity-70">{l}</a></li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	);
}

// ── Page ────────────────────────────────────────────────────────────────

export default function ObjectPageOptionOne() {
	const [imageIndex, setImageIndex] = useState(0);
	const [showTranscript, setShowTranscript] = useState(false);
	const [showMore, setShowMore] = useState(false);

	// keep the page title in sync for the demo
	useEffect(() => {
		document.title = "Standard Lamp | National Trust for Scotland";
	}, []);

	const go = (d: number) => setImageIndex((i) => (i + d + IMAGES.length) % IMAGES.length);

	return (
		<ScopePage id="object-page-option-one">
			<div className={`${brandSans.className} bg-white text-[var(--nts-ink)] antialiased`} style={THEME}>
				<Header />

				{/* Main object area */}
				<div className="bg-[var(--nts-bg)]">
					<div className="mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-[80px] lg:pb-[60px] lg:pt-[30px]">
						<nav aria-label="Breadcrumb" className="overflow-x-auto">
							<ol className="flex items-center gap-[22px] whitespace-nowrap text-[15px]">
								{["Home", "Collections", "Charles Rennie Mackintosh", "Search"].map((c) => (
									<li key={c} className="flex items-center gap-[22px]">
										<a href="#" onClick={(e) => e.preventDefault()} className="underline underline-offset-[3px] hover:text-[var(--nts-pink)]">{c}</a>
										<svg viewBox="0 0 10 14" className="h-3 w-2" aria-hidden="true"><path d="M2 1.5 7.5 7 2 12.5" fill="none" stroke="currentColor" strokeWidth="2.2" /></svg>
									</li>
								))}
								<li aria-current="page">Standard Lamp</li>
							</ol>
						</nav>

						<div className="mt-[30px] grid gap-10 lg:grid-cols-[minmax(0,733fr)_minmax(0,515fr)] lg:gap-[33px]">
							{/* Left: viewer (sticky on desktop) */}
							<div className="lg:self-start lg:sticky lg:top-6">
								<ImageViewer images={IMAGES} index={imageIndex} onIndexChange={setImageIndex} />

								<div className="mt-6 flex justify-center">
									<button type="button" onClick={() => setShowTranscript((s) => !s)} aria-expanded={showTranscript} className="flex items-center gap-[10px] text-[15px] hover:text-[var(--nts-pink)]">
										<svg viewBox="0 0 16 20" className="h-[19px] w-[16px]" aria-hidden="true">
											<path d="M0 2a2 2 0 0 1 2-2h8l6 6v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2Z" fill="var(--nts-pink)" />
											<path d="M4 10h8M4 13h8M4 16h5" stroke="#fff" strokeWidth="1.6" />
										</svg>
										{showTranscript ? "Hide transcript" : "Show transcript"}
									</button>
								</div>

								{showTranscript && (
									<div className="mt-4 max-h-[320px] overflow-y-auto border-l-4 border-[var(--nts-pink)] bg-white px-6 py-5">
										<p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-gray-500">Transcript · Image {imageIndex + 1} of {IMAGES.length}</p>
										<div className="mt-3 text-[15px] leading-[1.7]">
											{IMAGES[imageIndex].transcript.map((line, i) => (line ? <p key={i}>{line}</p> : <div key={i} className="h-3" />))}
										</div>
									</div>
								)}

								{/* Thumbnails */}
								<div className="mt-[22px] flex items-center justify-center gap-5">
									<button type="button" onClick={() => go(-1)} aria-label="Previous image" className="transition-transform hover:scale-110"><Chevron dir="left" /></button>
									{IMAGES.map((img, i) => (
										<button
											key={img.src}
											type="button"
											onClick={() => setImageIndex(i)}
											aria-label={`Show image ${i + 1}`}
											aria-current={i === imageIndex}
											className={`h-[77px] w-[77px] overflow-hidden border-[3px] transition-colors ${i === imageIndex ? "border-[var(--nts-pink)]" : "border-transparent hover:border-gray-400"}`}
										>
											{/* biome-ignore lint/performance/noImgElement: static demo image */}
											<img src={img.src} alt="" className="h-full w-full object-cover" />
										</button>
									))}
									<button type="button" onClick={() => go(1)} aria-label="Next image" className="transition-transform hover:scale-110"><Chevron dir="right" /></button>
								</div>
								<p className="mt-3 text-center text-[14px]" aria-live="polite">Image {imageIndex + 1} of {IMAGES.length}</p>
							</div>

							{/* Right: details */}
							<div>
								<h1 className="text-[44px] font-bold leading-[1.1] tracking-[-0.01em] sm:text-[48px]">Standard Lamp</h1>

								<section className="mt-7">
									<h2 className="text-[32px] font-bold leading-tight">Key details</h2>
									<div className="mt-5 flex flex-col gap-[30px]">
										<Field label="Creator">
											<Stack>
												<span><Lnk>Charles Rennie Mackintosh</Lnk> (Designer)</span>
												<span><Lnk>John Craig</Lnk> (Maker)</span>
											</Stack>
										</Field>
										<Field label="Date">1905</Field>
										<Field label="Location"><Lnk>The Hill House</Lnk></Field>
										<Field label="On display">Yes</Field>
										<Field label="Object category"><Lnk>Furniture</Lnk></Field>
									</div>
								</section>

								<hr className="mt-14 h-[3px] border-0 bg-gradient-to-r from-gray-300/60 via-gray-300 to-gray-300/40 [border-radius:50%]" />

								<section className="mt-14">
									<h2 className="text-[32px] font-bold leading-tight">Description</h2>
									<div className="mt-4 space-y-4 text-[16px] leading-[1.5]">
										<p>{DESCRIPTION}</p>
										<div className={`grid transition-[grid-template-rows] duration-300 ${showMore ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
											<div className="space-y-4 overflow-hidden">
												{DESCRIPTION_MORE.map((p) => <p key={p}>{p}</p>)}
											</div>
										</div>
									</div>
									<div className="mt-5 flex justify-center">
										<button type="button" onClick={() => setShowMore((s) => !s)} aria-expanded={showMore} className="flex items-center gap-3 text-[15px] hover:text-[var(--nts-pink)]">
											<svg viewBox="0 0 12 8" className={`h-2 w-3 transition-transform ${showMore ? "rotate-180" : ""}`} aria-hidden="true"><path d="M1.5 1.5 6 6l4.5-4.5" fill="none" stroke="var(--nts-pink)" strokeWidth="2" /></svg>
											{showMore ? "Show less" : "Show more"}
										</button>
									</div>
								</section>

								<hr className="mt-12 border-t-2 border-gray-200" />

								<section className="mt-10">
									<h2 className="text-[32px] font-bold leading-tight">Object information</h2>
									<div className="mt-4 flex flex-col gap-[38px]">
										<Field label="Material">
											<Stack>
												<Lnk>Sycamore</Lnk>
												<Lnk>Mother of Pearl</Lnk>
											</Stack>
										</Field>
										<Field label="Measurements">Height: 140cm</Field>
										<Field label="Themes">
											<Stack>
												<Lnk>Lighting</Lnk>
												<Lnk>Interiors</Lnk>
											</Stack>
										</Field>
										<Field label="Associated person"><Lnk>Walter Blackie</Lnk></Field>
										<Field label="Provenance">
											Commissioned by Walter Blackie for The Hill House, Helensburgh; remained in the house until it passed to the National Trust for Scotland.
										</Field>
										<Field label="Acquisition date">1982</Field>
										<Field label="Object number">2.27.1</Field>
									</div>
								</section>
							</div>
						</div>
					</div>
				</div>

				{/* You might like */}
				<section className="mx-auto max-w-[1440px] px-4 pb-[90px] pt-[50px] sm:px-[80px]">
					<h2 className="text-center text-[40px] font-bold leading-tight sm:text-[48px]">You might like</h2>
					<div className="mt-9 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
						{RELATED.map((r) => (
							<a key={r.title} href="#" onClick={(e) => e.preventDefault()} className="group block">
								<div className="aspect-[296/164] bg-[#D9D9D9] transition-colors group-hover:bg-[#cfcfcf]" />
								<p className="mt-5 text-[13px] text-[var(--nts-plum)]">{r.type}</p>
								<h3 className="mt-2 text-[19px] font-semibold leading-[1.35] tracking-[0.01em] decoration-[var(--nts-pink)] decoration-2 underline-offset-4 group-hover:underline">{r.title}</h3>
								<p className="mt-3 text-[13px] text-gray-500">{r.date}</p>
							</a>
						))}
					</div>
				</section>

				{/* Caring for collections */}
				<section>
					<BrushEdge fill="var(--nts-teal)" streak="#fff" seed={7} />
					<div className="bg-[var(--nts-teal)] px-4 pb-14 pt-6 text-center text-white">
						<h2 className="text-[40px] font-semibold leading-tight sm:text-[50px]">Caring for collections</h2>
						<p className="mx-auto mt-4 max-w-[830px] text-[16px] leading-[1.5]">
							A gift of £5 a month can help us ensure collections like the Robert Burns Collection receive ongoing care and are shared with as many people as possible.
						</p>
						<a href="#" onClick={(e) => e.preventDefault()} className="mt-6 inline-flex items-center gap-8 bg-[var(--nts-yellow)] px-10 py-[14px] text-[15px] font-bold uppercase tracking-[0.14em] text-black shadow-sm transition-colors hover:bg-[#ecd23a]">
							Donate today
							<svg viewBox="0 0 20 16" className="h-4 w-5" aria-hidden="true"><path d="M2 14c0-7 3.5-12 8-12s8 5 8 12Z" fill="currentColor" /><path d="M1 14.5h18" stroke="currentColor" strokeWidth="2" /></svg>
						</a>
					</div>
					<BrushEdge fill="var(--nts-teal)" streak="#fff" flip seed={19} />
					<div className="h-6 bg-white" />
					<BrushEdge fill="var(--nts-footer)" streak="#fff" seed={31} />
				</section>

				<Footer />
			</div>
		</ScopePage>
	);
}
