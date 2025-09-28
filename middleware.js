import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

//****************************************************************************
// MIDDLEWARE SECURITY - DIRI TANAN AUTH CHECKING NATO MAHITABO
// Dili pwede ma access ang protected routes kung walay token
// Naa pud role checking para dili maka sulod ang user sa admin pages
//****************************************************************************
export function middleware(request) {
  const protectedPaths = ['/user-dashboard', '/live-ai-interview', '/profile', '/weakness-overview', '/admin']
  const adminPaths = ['/admin']
  const userPaths = ['/user-dashboard', '/live-ai-interview', '/profile', '/weakness-overview']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath) {
    //*******************************************************************
    // TOKEN CHECKING 
    // Kung walay token, di ka maka sulod. Balik sa login page ka
    // Security first aron dili ma hack ang system
    //*******************************************************************
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const isAdminPath = adminPaths.some(path => request.nextUrl.pathname.startsWith(path))
      const isUserPath = userPaths.some(path => request.nextUrl.pathname.startsWith(path))
      
      if (isAdminPath && decoded.userType !== 'admin') {
        return NextResponse.redirect(new URL('/user-dashboard', request.url))
      }
      
      if (isUserPath && decoded.userType === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
return NextResponse.next()
}

export const config = {
  matcher: ['/user-dashboard/:path*', '/live-ai-interview/:path*', '/profile/:path*', '/weakness-overview/:path*', '/admin/:path*']
}