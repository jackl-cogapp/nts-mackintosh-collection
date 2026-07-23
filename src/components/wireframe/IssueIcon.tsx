import { issueTracker } from "@/lib/scope";

/**
 * Issue tracker icon. Renders the logomark for the project's configured
 * tracker (Linear or Jira). To add another tracker, extend `IssueTracker`
 * in `scope.ts` and add a branch here.
 */
export function IssueIcon({ className }: { className?: string }) {
	if (issueTracker === "jira") return <JiraIcon className={className} />;
	return <LinearIcon className={className} />;
}

function LinearIcon({ className }: { className?: string }) {
	return (
		<svg
			width={12}
			height={12}
			viewBox="0 0 100 100"
			fill="currentColor"
			className={className}
			role="img"
			aria-label="Linear"
		>
			<path d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957165.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.43566 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68399 5.1855ZM12.6587 18.074c-.3701-.3701-.393-.9637-.0443-1.3541C21.7795 6.45931 35.1114 0 49.9519 0 77.5927 0 100 22.4073 100 50.0481c0 14.8405-6.4593 28.1724-16.7199 37.3375-.3903.3487-.984.3258-1.3542-.0443L12.6587 18.074Z" />
		</svg>
	);
}

function JiraIcon({ className }: { className?: string }) {
	return (
		<svg
			width={12}
			height={12}
			viewBox="0 0 64 64"
			className={className}
			role="img"
			aria-label="Jira"
		>
			<path
				fill="currentColor"
				d="M61.874 30.007L34.417 2.55 31.758-.11 11.103 20.544.656 30.991a2.226 2.226 0 000 3.145l20.872 20.872L31.758 65.25l20.655-20.655.32-.32 9.141-9.123a2.226 2.226 0 000-3.145zM31.758 44.59l-10.434-10.43 10.434-10.435 10.435 10.435-10.435 10.43z"
			/>
		</svg>
	);
}
