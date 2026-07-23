import { type NextRequest, NextResponse } from "next/server";

// Cogapp office egress IP — bypasses the password prompt entirely.
const ALLOWED_IPS = ["195.10.209.128"];

function getClientIp(request: NextRequest): string | null {
	const forwardedFor = request.headers.get("x-forwarded-for");
	if (forwardedFor) return forwardedFor.split(",")[0].trim();
	return request.headers.get("x-real-ip");
}

export function middleware(request: NextRequest) {
	const clientIp = getClientIp(request);
	if (clientIp && ALLOWED_IPS.includes(clientIp)) {
		return NextResponse.next();
	}

	const sitePassword = process.env.SITE_PASSWORD;
	if (!sitePassword) return NextResponse.next();
	const siteUsername = process.env.SITE_USERNAME;

	const authHeader = request.headers.get("authorization");
	if (authHeader?.startsWith("Basic ")) {
		const decoded = atob(authHeader.slice(6));
		const sepIndex = decoded.indexOf(":");
		const username = decoded.slice(0, sepIndex);
		const password = decoded.slice(sepIndex + 1);
		const usernameOk = siteUsername ? username === siteUsername : true;
		if (usernameOk && password === sitePassword) return NextResponse.next();
	}

	return new NextResponse("Authentication required", {
		status: 401,
		headers: { "WWW-Authenticate": 'Basic realm="Mackintosh Collection Wireframes"' },
	});
}

export const config = {
	matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
