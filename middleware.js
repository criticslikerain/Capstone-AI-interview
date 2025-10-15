import { NextResponse } from 'next/server'

// Simple middleware - Firebase Auth handles authentication on client side
export function middleware(request) {
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*']
}