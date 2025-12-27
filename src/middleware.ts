import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
    ],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;

    // Get hostname (e.g. app.barbersaas.com or joao.barbersaas.com)
    // Handle Vercel preview URLs or localhost
    const hostname = req.headers.get("host") || "";

    // Define allowed domains (localhost, main domain)
    // Adjust these based on your environment variables or hardcoded for now
    let currentHost = hostname
        .replace(`.localhost:3000`, "") // Remove localhost port for local dev
        .replace(`.barbearia.vercel.app`, "") // Replace Vercel domain if specific
        .replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, ""); // Best practice if env var exists

    // Handle root domain specifically
    // If we are on localhost:3000, currentHost is still "localhost:3000" because the replace looked for ".localhost:3000"
    if (currentHost === "localhost:3000" || currentHost === "barbearia.vercel.app" || currentHost === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
        currentHost = "";
    }

    // CASE 1: "app" subdomain -> Dashboard
    if (currentHost === "app") {
        // If visiting root, redirect to dashboard
        if (url.pathname === "/") {
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }

        // --- Existing Auth Protection Logic ---
        const authToken = req.cookies.get('auth_token');
        const isDashboard = url.pathname.startsWith('/dashboard');

        if (isDashboard && !authToken) {
            // Redirect to login if trying to access dashboard without token
            // Ensure we are redirecting to the login page on the app subdomain
            return NextResponse.redirect(new URL('/login', req.url));
        }
        // --------------------------------------

        // Allow request to proceed normally for app subdomain
        // It will map to the file system (e.g. /dashboard -> src/app/dashboard)
        return NextResponse.next();
    }

    // CASE 2: Root Domain -> Marketing Page
    if (currentHost === "") {
        // Just let Next.js handle it (src/app/page.tsx or whatever matches /)
        return NextResponse.next();
    }

    // CASE 3: Public Site Subdomains (e.g. "joao-barber.barbersaas.com")
    // If it's NOT "app" and NOT root, we treat it as a tenant subdomain.
    // We rewrite the request to `/site/${currentHost}` (plus any path).
    // This maps to `src/app/(site)/site/[slug]/page.tsx`.

    // Rewrite path: /site/[slug]/...
    url.pathname = `/site/${currentHost}${url.pathname}`;

    return NextResponse.rewrite(url);
}
