"use client";

import { type PointerEvent as RPointerEvent, useCallback, useEffect, useRef, useState } from "react";

export type ViewerImage = { src: string; alt: string; transcript: string[] };

const MIN = 1;
const MAX = 6;
const STEP = 1.4;
const PAN = 80;

type Icon = "full" | "in" | "out" | "home" | "adjust" | "download" | "lock" | "unlock" | "up" | "down" | "left" | "right";

function Glyph({ name }: { name: Icon }) {
	const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
	switch (name) {
		case "full":
			return <svg viewBox="0 0 24 24" className="h-4 w-4" {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5M4 4l6 6M20 4l-6 6M4 20l6-6M20 20l-6-6" /></svg>;
		case "in":
			return <svg viewBox="0 0 24 24" className="h-4 w-4" {...p}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 20 20M8 10.5h5M10.5 8v5" /></svg>;
		case "out":
			return <svg viewBox="0 0 24 24" className="h-4 w-4" {...p}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 20 20M8 10.5h5" /></svg>;
		case "home":
			return <svg viewBox="0 0 24 24" className="h-4 w-4" {...p}><path d="M4 11 12 4l8 7M6.5 9.5V20h11V9.5M10 20v-5h4v5" /></svg>;
		case "adjust":
			return <svg viewBox="0 0 24 24" className="h-4 w-4" {...p}><path d="M7 4v16M12 4v16M17 4v16" /><path d="M5 9h4M10 15h4M15 8h4" /></svg>;
		case "download":
			return <svg viewBox="0 0 24 24" className="h-4 w-4" {...p}><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19h14" /></svg>;
		case "lock":
			return <svg viewBox="0 0 24 24" className="h-4 w-4" {...p}><rect x="5.5" y="10.5" width="13" height="9.5" rx="2" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /></svg>;
		case "unlock":
			return <svg viewBox="0 0 24 24" className="h-4 w-4" {...p}><rect x="5.5" y="10.5" width="13" height="9.5" rx="2" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 6.8-1.2" /></svg>;
		case "up":
			return <svg viewBox="0 0 24 24" className="h-4 w-4" {...p}><path d="M12 19V5M6 11l6-6 6 6" /></svg>;
		case "down":
			return <svg viewBox="0 0 24 24" className="h-4 w-4" {...p}><path d="M12 5v14M6 13l6 6 6-6" /></svg>;
		case "left":
			return <svg viewBox="0 0 24 24" className="h-4 w-4" {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
		case "right":
			return <svg viewBox="0 0 24 24" className="h-4 w-4" {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
	}
}

function CircleBtn({ icon, label, onClick, active, disabled }: { icon: Icon; label: string; onClick: () => void; active?: boolean; disabled?: boolean }) {
	return (
		<button
			type="button"
			title={label}
			aria-label={label}
			aria-pressed={active}
			disabled={disabled}
			onClick={onClick}
			className={`flex h-[26px] w-[26px] items-center justify-center rounded-full border shadow-sm transition-colors disabled:opacity-40 ${
				active ? "border-[var(--nts-pink)] bg-[var(--nts-pink)] text-white" : "border-gray-300 bg-white text-gray-700 hover:border-gray-500 hover:text-black"
			}`}
		>
			<Glyph name={icon} />
		</button>
	);
}

export default function ImageViewer({ images, index, onIndexChange }: { images: ViewerImage[]; index: number; onIndexChange: (i: number) => void }) {
	const frameRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
	const [scale, setScale] = useState(1);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [locked, setLocked] = useState(false);
	const [fullscreen, setFullscreen] = useState(false);
	const [adjustOpen, setAdjustOpen] = useState(false);
	const [brightness, setBrightness] = useState(100);
	const [contrast, setContrast] = useState(100);
	const [dragging, setDragging] = useState(false);

	const image = images[index];

	const clampOffset = useCallback((o: { x: number; y: number }, s: number) => {
		const el = stageRef.current;
		if (!el) return o;
		const maxX = (el.clientWidth * (s - 1)) / 2 + (s > 1 ? 40 : 0);
		const maxY = (el.clientHeight * (s - 1)) / 2 + (s > 1 ? 40 : 0);
		return { x: Math.max(-maxX, Math.min(maxX, o.x)), y: Math.max(-maxY, Math.min(maxY, o.y)) };
	}, []);

	const zoomTo = useCallback(
		(next: number, origin?: { x: number; y: number }) => {
			if (locked) return;
			setScale((prev) => {
				const s = Math.max(MIN, Math.min(MAX, next));
				setOffset((o) => {
					if (!origin) return clampOffset({ x: (o.x * s) / prev, y: (o.y * s) / prev }, s);
					// keep the point under the cursor fixed
					const k = s / prev;
					return clampOffset({ x: origin.x - (origin.x - o.x) * k, y: origin.y - (origin.y - o.y) * k }, s);
				});
				return s;
			});
		},
		[locked, clampOffset],
	);

	const reset = useCallback(() => {
		setScale(1);
		setOffset({ x: 0, y: 0 });
		setBrightness(100);
		setContrast(100);
	}, []);

	// reset when the image changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: reset on index change only
	useEffect(() => {
		setScale(1);
		setOffset({ x: 0, y: 0 });
	}, [index]);

	// wheel zoom (non-passive so the page doesn't scroll)
	useEffect(() => {
		const el = stageRef.current;
		if (!el) return;
		const onWheel = (e: WheelEvent) => {
			if (locked) return;
			e.preventDefault();
			const r = el.getBoundingClientRect();
			const origin = { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
			setScale((prev) => {
				const s = Math.max(MIN, Math.min(MAX, prev * Math.exp(-e.deltaY * 0.0025)));
				setOffset((o) => {
					const k = s / prev;
					return clampOffset({ x: origin.x - (origin.x - o.x) * k, y: origin.y - (origin.y - o.y) * k }, s);
				});
				return s;
			});
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, [locked, clampOffset]);

	useEffect(() => {
		const onFs = () => setFullscreen(document.fullscreenElement === frameRef.current);
		document.addEventListener("fullscreenchange", onFs);
		return () => document.removeEventListener("fullscreenchange", onFs);
	}, []);

	// keyboard shortcuts when the viewer has focus
	const onKeyDown = (e: React.KeyboardEvent) => {
		const map: Record<string, () => void> = {
			"+": () => zoomTo(scale * STEP),
			"=": () => zoomTo(scale * STEP),
			"-": () => zoomTo(scale / STEP),
			"0": reset,
			ArrowUp: () => pan(0, PAN),
			ArrowDown: () => pan(0, -PAN),
			ArrowLeft: () => pan(PAN, 0),
			ArrowRight: () => pan(-PAN, 0),
		};
		if (map[e.key]) {
			e.preventDefault();
			map[e.key]();
		}
	};

	const pan = (dx: number, dy: number) => {
		if (locked) return;
		setOffset((o) => clampOffset({ x: o.x + dx, y: o.y + dy }, scale));
	};

	const toggleFullscreen = () => {
		if (document.fullscreenElement) document.exitFullscreen();
		else frameRef.current?.requestFullscreen?.();
	};

	const onPointerDown = (e: RPointerEvent) => {
		if (locked || scale <= 1) return;
		(e.target as Element).setPointerCapture(e.pointerId);
		drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
		setDragging(true);
	};
	const onPointerMove = (e: RPointerEvent) => {
		const d = drag.current;
		if (!d) return;
		setOffset(clampOffset({ x: d.ox + e.clientX - d.x, y: d.oy + e.clientY - d.y }, scale));
	};
	const endDrag = () => {
		drag.current = null;
		setDragging(false);
	};

	return (
		<div
			ref={frameRef}
			className={`relative select-none overflow-hidden bg-[#DADADC] outline-none focus-visible:ring-2 focus-visible:ring-[var(--nts-pink)] ${
				fullscreen ? "h-screen w-screen" : "aspect-[4/5] w-full sm:aspect-[733/600]"
			}`}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: viewer accepts keyboard zoom/pan
			tabIndex={0}
			onKeyDown={onKeyDown}
			aria-label={`Image viewer: ${image.alt}. Use plus and minus to zoom, arrow keys to pan.`}
		>
			{/* Stage */}
			<div
				ref={stageRef}
				className={`absolute left-2 right-11 top-2 bottom-[92px] sm:inset-x-[6.4%] sm:top-[12%] sm:bottom-[16.5%]${scale > 1 && !locked ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
				onDoubleClick={(e) => {
					const r = e.currentTarget.getBoundingClientRect();
					zoomTo(scale * 2, { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 });
				}}
				style={{ touchAction: scale > 1 ? "none" : "auto" }}
			>
				{/* biome-ignore lint/performance/noImgElement: static demo image */}
				<img
					key={image.src}
					src={image.src}
					alt={image.alt}
					draggable={false}
					className="h-full w-full object-contain"
					style={{
						transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
						transition: dragging ? "none" : "transform 200ms ease-out",
						filter: `brightness(${brightness}%) contrast(${contrast}%)`,
					}}
				/>
			</div>

			{/* Right-hand tool column */}
			<div className="absolute right-[2.2%] top-[2.2%] flex flex-col gap-[9px]">
				<CircleBtn icon="full" label={fullscreen ? "Exit full screen" : "Full screen"} onClick={toggleFullscreen} active={fullscreen} />
				<CircleBtn icon="in" label="Zoom in" onClick={() => zoomTo(scale * STEP)} disabled={locked || scale >= MAX} />
				<CircleBtn icon="out" label="Zoom out" onClick={() => zoomTo(scale / STEP)} disabled={locked || scale <= MIN} />
				<CircleBtn icon="home" label="Reset view" onClick={reset} />
				<CircleBtn icon="adjust" label="Adjust image" onClick={() => setAdjustOpen((o) => !o)} active={adjustOpen} />
				<a
					href={image.src}
					download
					title="Download image"
					aria-label="Download image"
					className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-gray-500 hover:text-black"
				>
					<Glyph name="download" />
				</a>
				<CircleBtn icon={locked ? "lock" : "unlock"} label={locked ? "Unlock zoom and pan" : "Lock zoom and pan"} onClick={() => setLocked((l) => !l)} active={locked} />
			</div>

			{/* Adjust panel */}
			{adjustOpen && (
				<div className="absolute right-[calc(2.2%+38px)] top-[calc(2.2%+140px)] w-56 rounded-md bg-white p-4 text-sm shadow-lg">
					<label className="block">
						<span className="flex justify-between text-gray-700">
							Brightness <span className="tabular-nums text-gray-500">{brightness}%</span>
						</span>
						<input type="range" min={50} max={160} value={brightness} onChange={(e) => setBrightness(+e.target.value)} className="mt-1 w-full accent-[var(--nts-pink)]" />
					</label>
					<label className="mt-3 block">
						<span className="flex justify-between text-gray-700">
							Contrast <span className="tabular-nums text-gray-500">{contrast}%</span>
						</span>
						<input type="range" min={50} max={180} value={contrast} onChange={(e) => setContrast(+e.target.value)} className="mt-1 w-full accent-[var(--nts-pink)]" />
					</label>
					<button type="button" onClick={() => { setBrightness(100); setContrast(100); }} className="mt-3 text-xs underline decoration-[var(--nts-pink)] underline-offset-4">
						Reset adjustments
					</button>
				</div>
			)}

			{/* Pan pad */}
			<div className="absolute bottom-[3.5%] left-[1.6%] grid grid-cols-3 gap-[9px]">
				<span />
				<CircleBtn icon="up" label="Pan up" onClick={() => pan(0, PAN)} disabled={locked || scale <= 1} />
				<span />
				<CircleBtn icon="left" label="Pan left" onClick={() => pan(PAN, 0)} disabled={locked || scale <= 1} />
				<CircleBtn icon="down" label="Pan down" onClick={() => pan(0, -PAN)} disabled={locked || scale <= 1} />
				<CircleBtn icon="right" label="Pan right" onClick={() => pan(-PAN, 0)} disabled={locked || scale <= 1} />
			</div>

			{/* Zoom readout */}
			{scale > 1 && (
				<span className="absolute bottom-[3.5%] right-[2.2%] rounded bg-black/60 px-2 py-0.5 text-xs tabular-nums text-white">{Math.round(scale * 100)}%</span>
			)}

			{/* In full screen, allow paging between images */}
			{fullscreen && images.length > 1 && (
				<div className="absolute bottom-[3.5%] left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/90 px-3 py-1 text-sm shadow">
					<button type="button" onClick={() => onIndexChange((index - 1 + images.length) % images.length)} aria-label="Previous image">‹</button>
					<span>Image {index + 1} of {images.length}</span>
					<button type="button" onClick={() => onIndexChange((index + 1) % images.length)} aria-label="Next image">›</button>
				</div>
			)}
		</div>
	);
}
