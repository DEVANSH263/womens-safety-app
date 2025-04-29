import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Define paths that require authentication
  const isProtectedRoute = 
    (path.startsWith('/dashboard') && !path.includes('/sos')) || 
    path.startsWith('/profile')

  // Define public paths (login, signup, home, sos, etc.)
  const isPublicPath = 
    path === '/login' || 
    path === '/signup' || 
    path === '/' || 
    path.startsWith('/api/alerts/sos') ||
    path.startsWith('/sos-alarm') ||
    path.startsWith('/api/auth') ||
    path.includes('/sos')

  // Get token from cookies
  const token = request.cookies.get('token')?.value

  // Redirect logic
  if (isProtectedRoute && !token) {
    // If trying to access protected route without token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublicPath && token) {
    // If already logged in and trying to access login/signup, redirect to dashboard
    if (path === '/login' || path === '/signup') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 