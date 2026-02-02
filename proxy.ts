import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/home(.*)',
  '/api/video-upload',
  '/api/image-upload',
  '/social-share(.*)',
  '/video-upload(.*)',
])

export default clerkMiddleware(async (auth, req) => {

  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!trpc|_next/static|_next/image|favicon.ico|.*\\..*|sign-in|sign-up).*)',
    '/api/video-upload',
    '/api/image-upload',
  ],
}