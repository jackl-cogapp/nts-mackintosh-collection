"use client";

import { Suspense } from "react";
import { usePageVariations } from "@/components/wireframe";
import CrmSearchMvp from "./CrmSearchMvp";
import CrmSearchUiTweaks from "./CrmSearchUiTweaks";

// MVP is the search page as originally agreed; UI Tweaks holds the
// proposed filter/layout/card changes that are not yet in MVP scope.
const VARIATIONS = [
	{ key: "mvp", label: "MVP" },
	{ key: "ui-tweaks", label: "UI Tweaks" },
] as const;

function CRMSearchContent() {
	const variation = usePageVariations(VARIATIONS);
	return variation === "ui-tweaks" ? <CrmSearchUiTweaks /> : <CrmSearchMvp />;
}

export default function CRMSearchPage() {
	return (
		<Suspense>
			<CRMSearchContent />
		</Suspense>
	);
}
