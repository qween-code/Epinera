import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if user profile exists (trigger should create it, but we verify)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', user.id)
          .single()

        // If profile doesn't exist, create it (fallback if trigger didn't fire)
        if (profileError && profileError.code === 'PGRST116') {
          const metadata = user.user_metadata || {}
          await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: metadata.full_name || metadata.name || null,
              avatar_url: metadata.avatar_url || metadata.picture || null,
              phone: metadata.phone || null,
              role: 'buyer',
              kyc_status: 'not_started',
              metadata: {},
            })
        }

        // If profile is incomplete (no name or avatar), redirect to complete-profile
        if (profile && (!profile.full_name || !profile.avatar_url)) {
          return NextResponse.redirect(`${origin}/complete-profile`)
        }

        // If user just signed up (new user), redirect to onboarding or complete-profile
        // Check if this is a new user by checking created_at
        const userCreatedAt = new Date(user.created_at)
        const now = new Date()
        const minutesSinceCreation = (now.getTime() - userCreatedAt.getTime()) / (1000 * 60)
        
        // If user was created less than 5 minutes ago, likely a new signup
        if (minutesSinceCreation < 5) {
          // Check if profile is complete
          if (profile && profile.full_name && profile.avatar_url) {
            // Profile is complete, go to dashboard
            return NextResponse.redirect(`${origin}${next}`)
          } else {
            // Profile incomplete, go to complete-profile
            return NextResponse.redirect(`${origin}/complete-profile`)
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
