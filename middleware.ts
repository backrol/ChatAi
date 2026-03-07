import { createClient } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request)

    // Refresh session jika expired
    const { data: { session } } = await supabase.auth.getSession()

    // Proteksi halaman /chat
    if (request.nextUrl.pathname.startsWith('/chat')) {
      if (!session) {
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Jika sudah login dan mencoba akses /login, redirect ke /chat
    if (request.nextUrl.pathname === '/login' && session) {
      return NextResponse.redirect(new URL('/chat', request.url))
    }

    return response
  } catch (e) {
    return NextResponse.next({
      request: { headers: request.headers },
    })
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
