const FOOTER_COLUMNS = [
	{
		heading: "Holidays & Venue Hire",
		links: ["Holiday accommodation", "Venue hire", "Weddings", "Ghost trails", "Lettings"],
	},
	{
		heading: "About the Trust",
		links: ["Our work", "Our people", "Careers at the Trust", "Partners", "How to reach"],
	},
	{
		heading: "Get in Touch",
		links: ["Contact us", "FAQ", "Media centre", "Filming & photography", "Shop FAQ"],
	},
];

export default function NtsFooter() {
	return (
		<div className="bg-gray-800 px-6 py-10 text-white">
			<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
				{FOOTER_COLUMNS.map((col) => (
					<div key={col.heading}>
						<p className="mb-3 font-mono text-label uppercase tracking-wide text-gray-400">
							{col.heading}
						</p>
						<ul className="flex flex-col gap-1.5">
							{col.links.map((link) => (
								<li key={link} className="font-mono text-meta text-gray-300">
									{link}
								</li>
							))}
						</ul>
					</div>
				))}
				<div>
					<p className="mb-3 font-mono text-label uppercase tracking-wide text-gray-400">
						Donate
					</p>
					<p className="mb-4 font-mono text-meta text-gray-300">
						Help protect our treasured places — now and for future generations.
					</p>
					<div className="inline-block bg-yellow-400 px-4 py-2">
						<span className="font-mono text-label font-bold uppercase text-black">
							Donation →
						</span>
					</div>
				</div>
			</div>
			<div className="mt-8 flex items-center justify-between border-t border-gray-700 pt-6">
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-600">
						<span className="font-mono text-[8px] font-bold text-gray-400">NTS</span>
					</div>
					<span className="font-mono text-meta text-gray-400">
						National Trust for Scotland
					</span>
				</div>
				<div className="flex gap-4">
					{["Instagram", "Facebook", "YouTube"].map((s) => (
						<span key={s} className="font-mono text-meta text-gray-400">
							{s}
						</span>
					))}
				</div>
			</div>
			<div className="mt-4 flex gap-4">
				{["Terms & conditions", "Privacy & data protection", "Cookies", "Contact"].map((l) => (
					<span key={l} className="font-mono text-meta text-gray-500 underline">
						{l}
					</span>
				))}
			</div>
		</div>
	);
}
