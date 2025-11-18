import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('Middleware triggered for request:', request.url);
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Anon Key:', supabaseAnonKey);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are not set!');
    // Instead of returning error, redirect to a setup page or show helpful message
    // For now, we'll allow the request to continue but log the warning
    console.warn('⚠️  Supabase environment variables missing. Please configure .env.local file.');
    // Return a helpful error page instead of JSON
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <title>Configuration Required</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; background: #1a1a1a; color: #fff; }
    .container { max-width: 600px; margin: 0 auto; }
    h1 { color: #ff6b6b; }
    .step { background: #2a2a2a; padding: 20px; margin: 10px 0; border-radius: 8px; }
    code { background: #000; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚠️ Configuration Required</h1>
    <p>Supabase environment variables are not set. Please follow these steps:</p>
    <div class="step">
      <h3>Step 1: Get Supabase Keys</h3>
      <p>1. Go to <a href="https://supabase.com/dashboard" style="color: #4ecdc4;">Supabase Dashboard</a></p>
      <p>2. Select your project</p>
      <p>3. Go to Settings > API</p>
      <p>4. Copy the following values:</p>
      <ul>
        <li><code>Project URL</code> → NEXT_PUBLIC_SUPABASE_URL</li>
        <li><code>anon public</code> key → NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
        <li><code>service_role</code> key → SUPABASE_SERVICE_ROLE_KEY</li>
      </ul>
    </div>
    <div class="step">
      <h3>Step 2: Update .env.local</h3>
      <p>Open <code>epin-marketplace/.env.local</code> and add:</p>
      <pre style="background: #000; padding: 15px; border-radius: 4px; overflow-x: auto;">
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key</pre>
    </div>
    <div class="step">
      <h3>Step 3: Restart Server</h3>
      <p>1. Stop the development server (Ctrl+C)</p>
      <p>2. Restart: <code>npm run dev</code></p>
      <p>3. Refresh this page</p>
    </div>
  </div>
</body>
</html>`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getSession()

  return response
}

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
