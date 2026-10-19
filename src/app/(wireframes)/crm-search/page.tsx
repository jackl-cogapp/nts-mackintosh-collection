"use client";

import { Suspense } from "react";
import { usePageVariations } from "@/components/wireframe";
import CrmSearchMvp from "./CrmSearchMvp";
import CrmSearchMasonry from "./CrmSearchMasonry";
import CrmSearchUiTweaks from "./CrmSearchUiTweaks";

// MVP is the search page as originally agreed; UI Tweaks holds the
// proposed filter/layout/card changes that are not yet in MVP scope.
// Masonry starts as a copy of UI Tweaks for exploring a masonry results grid.
const VARIATIONS = [
	{ key: "mvp", label: "MVP" },
	{ key: "ui-tweaks", label: "UI Tweaks" },
	{ key: "masonry", label: "Masonry" },
] as const;

function CRMSearchContent() {
	const variation = usePageVariations(VARIATIONS);
	if (variation === "ui-tweaks") return <CrmSearchUiTweaks />;
	if (variation === "masonry") return <CrmSearchMasonry />;
	return <CrmSearchMvp />;
}

export default function CRMSearchPage() {
	return (
		<Suspense>
			<CRMSearchContent />
		</Suspense>
	);
}
