export interface ScopeEntry {
	mvp: boolean;
	note?: string;
	issueUrl?: string;
}

export type IssueTracker = "linear" | "jira";
export const issueTracker: IssueTracker = "linear";

const linear = (id: string) => `https://linear.app/team/issue/${id}`;
const issue = linear;

export const scope: Record<string, ScopeEntry> = {
	"collection-home/Hero": { mvp: false, issueUrl: issue("MAC-3") },
	"collection-home/Collections search": { mvp: false, issueUrl: issue("MAC-4") },
	"collection-home/Explore by theme": { mvp: false, note: "Bubble sizing TBD", issueUrl: issue("MAC-5") },
	"collection-home/Explore iconic works": { mvp: false, issueUrl: issue("MAC-6") },
	"collection-home-mvp/Hero": { mvp: true, issueUrl: issue("MAC-3") },
	"collection-home-mvp/Collections search": { mvp: true, issueUrl: issue("MAC-4") },
	// Browse by page, copy of the MVP landing page
	"browse-by/Hero": { mvp: false, issueUrl: issue("MAC-3") },
	"browse-by/Collections search": { mvp: false, issueUrl: issue("MAC-4") },
	"timeline/Page header": { mvp: false, issueUrl: issue("MAC-7") },
	"timeline/Timeline": { mvp: false, note: "Content and dates to be confirmed", issueUrl: issue("MAC-8") },
	"map/Page header": { mvp: false, issueUrl: issue("MAC-9") },
	"map/Map explorer": { mvp: false, note: "Map provider TBD", issueUrl: issue("MAC-10") },
	"crm-item/Image viewer": { mvp: true, issueUrl: issue("CRM-5") },
	"crm-item/Key details": { mvp: true, issueUrl: issue("CRM-6") },
	"crm-item/Description": { mvp: true, issueUrl: issue("CRM-7") },
	"crm-item/Object information": { mvp: true, issueUrl: issue("CRM-8") },
	// Object Page tombstone layout, split out of the Object Page tabs
	"object-page-tombstone/Image viewer": { mvp: false, issueUrl: issue("CRM-5") },
	"object-page-tombstone/Key details": { mvp: false, issueUrl: issue("CRM-6") },
	"object-page-tombstone/Description": { mvp: false, issueUrl: issue("CRM-7") },
	"object-page-tombstone/Object information": { mvp: false, issueUrl: issue("CRM-8") },
	"crm-search/Hero": { mvp: true, issueUrl: issue("CRM-1") },
	"crm-search/Search bar": { mvp: true, issueUrl: issue("CRM-2") },
	"crm-search/Filters": { mvp: true, issueUrl: issue("CRM-3") },
	"crm-search/Results grid": { mvp: true, issueUrl: issue("CRM-4") },
	// "UI Tweaks" tab on /crm-search — proposed changes, not in MVP scope
	"crm-search-ui-tweaks/Hero": { mvp: true, issueUrl: issue("CRM-1") },
	"crm-search-ui-tweaks/Search bar": { mvp: false, note: "Proposed UI tweak: narrower search bar", issueUrl: issue("CRM-2") },
	"crm-search-ui-tweaks/Filters": { mvp: false, note: "Proposed UI tweak: sidebar raised level with the count/sort row", issueUrl: issue("CRM-3") },
	"crm-search-ui-tweaks/Results grid": { mvp: false, note: "Proposed UI tweak: count/sort row, filter chips, card fields", issueUrl: issue("CRM-4") },
	// "Masonry" tab on /crm-search — copy of UI Tweaks
	"crm-search-masonry/Hero": { mvp: true, issueUrl: issue("CRM-1") },
	"crm-search-masonry/Search bar": { mvp: false, note: "Proposed UI tweak: narrower search bar", issueUrl: issue("CRM-2") },
	"crm-search-masonry/Filters": { mvp: false, note: "Proposed UI tweak: sidebar raised level with the count/sort row", issueUrl: issue("CRM-3") },
	"crm-search-masonry/Results grid": { mvp: false, note: "Proposed UI tweak: count/sort row, filter chips, card fields", issueUrl: issue("CRM-4") },
};

export function getAnnotation(pageId: string | undefined, label: string): ScopeEntry | undefined {
	if (!pageId) return undefined;
	return scope[`${pageId}/${label}`];
}

export function isPageMvp(pageId: string): boolean {
	const prefix = `${pageId}/`;
	return Object.entries(scope).some(([key, entry]) => key.startsWith(prefix) && entry.mvp);
}

export interface ScopeRow extends ScopeEntry {
	pageId: string;
	label: string;
	key: string;
}

export function listScopeRows(): ScopeRow[] {
	return Object.entries(scope).map(([key, entry]) => {
		const slash = key.indexOf("/");
		return {
			pageId: slash >= 0 ? key.slice(0, slash) : key,
			label: slash >= 0 ? key.slice(slash + 1) : "",
			key,
			...entry,
		};
	});
}
