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
        // --- Existing Auth Protection Logic ---
        // const authToken = req.cookies.get('auth_token'); // OLD

        // Supabase Auth Check
        // We can't use createServerClient easily here without full setup, 
        // but we can check for the presence of the access token cookie or use a simplified check
        // Ideally we should use createServerClient from @supabase/ssr here to refresh session.
        // For now, let's look for the supabase cookie prefix standard or just assume if we have cookies.
        // But to be proper, let's replicate the server client creation for middleware pattern if possible,
        // or just check if `sb-access-token` or similar exists if we want to be lightweight.

        // However, standard Supabase Next.js middleware is recommended.
        // Since I can't easily import the complex server client factory with cookies() (which isn't available in middleware same way),
        // I will do a basic check for now or basic existence of supabase cookies.

        // To properly implement Supabase middleware:
        /*
          import { createServerClient } from '@supabase/ssr'
          ...
          const supabase = createServerClient(..., { cookies: { ... } })
          const { data: { user } } = await supabase.auth.getUser()
        */

        // Given constraints and imports, let's try to import the createClient from utils if adaptable, 
        // but server.ts usage 'next/headers' cookies() which throws in middleware.

        // FALLBACK: For this migration step, since I removed the manual cookie 'auth_token',
        // I will check for the Supabase session cookie presence roughly.
        // Actually, the most robust way without full refactor is to import standard response update.

        // Let's implement the standard Supabase middleware logic inline.

        const response = NextResponse.next({
            request: {
                headers: req.headers,
            },
        });

        const supabase = await import('@supabase/ssr').then(mod => mod.createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return req.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value));
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        );
                    },
                },
            }
        ));

        const { data: { user } } = await supabase.auth.getUser();

        const isDashboard = url.pathname.startsWith('/dashboard');

        if (isDashboard && !user) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        return response;
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
