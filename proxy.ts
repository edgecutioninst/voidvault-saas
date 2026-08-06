import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/home(.*)",
  "/api/video-upload",
  "/api/image-upload",
  "/api/videos(.*)",
  "/social-share(.*)",
  "/video-upload(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  if (req.nextUrl.pathname === "/") {
    const { userId } = await auth();

    if (userId) {
      return Response.redirect(new URL("/home", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!trpc|_next/static|_next/image|favicon.ico|.*\\..*|sign-in|sign-up).*)",
    "/api/video-upload",
    "/api/image-upload",
  ],
};
