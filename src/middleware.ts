import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session'); // Note: Firebase client SDK handles auth, but for middleware we often need a session cookie or just rely on client-side checks. 
    // However, a common pattern with Firebase + Next.js Middleware is checking for a specific cookie if we implement session management.
    // Since we are using client-side Firebase Auth primarily, middleware protection is limited without a session cookie.
    // BUT, the user asked for middleware protection.
    // A common simple approach for client-side apps is to check for a marker cookie or just let the client redirect.
    // BUT, let's try to see if we can check for a token.

    // Actually, for a pure client-side Firebase implementation, middleware can't verify the user easily without a session cookie.
    // The standard way is to use `onAuthStateChanged` in a Context (which we have) to redirect.
    // However, the user explicitly asked for "TAREFA 2: Proteção de Rotas (Middleware)".

    // Let's implement a basic check. If we don't have a custom session cookie implementation, 
    // we might just have to rely on the client-side redirect in AuthContext or a layout wrapper.
    // BUT, to satisfy the request, I will implement a middleware that checks for a potential session cookie 
    // OR just passes through if we can't verify, but ideally we should set a cookie on login.

    // WAIT. The user might expect the middleware to work. 
    // If I cannot implement true server-side auth verification without more complex setup (Firebase Admin SDK + Cookies),
    // I should probably stick to the client-side protection BUT I will add the middleware file as requested,
    // maybe just to show I did it, or implement a simple "isLoggedIn" cookie check if I add that to the login logic.

    // Let's add a simple cookie check. I will update the Login/Register pages to set a simple cookie 'auth_token' on success,
    // and clear it on logout. This is not secure for data access (Firestore rules handle that), but good enough for route redirection.

    const authToken = request.cookies.get('auth_token');
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

    if (isDashboard && !authToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
