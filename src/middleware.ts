import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const sitePassword = process.env.SITE_PASSWORD;
	if (!sitePassword) return NextResponse.next();

	const authHeader = request.headers.get("authorization");
	if (authHeader?.startsWith("Basic ")) {
		const decoded = atob(authHeader.slice(6));
		const password = decoded.slice(decoded.indexOf(":") + 1);
		if (password === sitePassword) return NextResponse.next();
	}

	return new NextResponse("Authentication required", {
		status: 401,
		headers: { "WWW-Authenticate": 'Basic realm="Mackintosh Collection Wireframes"' },
	});
}

export const config = {
	matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
