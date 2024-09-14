// import { getToken } from 'next-auth/jwt'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req })

//   if (!token) {
//     return NextResponse.redirect(new URL('/sign-in', req.nextUrl))
//   }
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: ['/r/:path*/submit', '/r/create'],
// }

import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}