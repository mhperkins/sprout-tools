import { createClient } from '@supabase/supabase-js';

const CLIENT_ID = process.env.CANVA_CLIENT_ID;
const CLIENT_SECRET = process.env.CANVA_CLIENT_SECRET;
const REDIRECT_URI = process.env.CANVA_REDIRECT_URI || 'http://localhost:3000/api/canva/callback';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}?canva_error=${error || 'no_code'}`, 302);
  }

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://api.canva.com/rest/v1/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });
    const token = await tokenRes.json();
    if (!tokenRes.ok || token.error) {
      throw new Error(token.error_description || token.error || 'Token exchange failed');
    }

    const expiry = new Date(Date.now() + (token.expires_in || 3600) * 1000).toISOString();

    // Upsert token into social_profile (stores one profile per org)
    await supabaseAdmin.from('social_profile').upsert({
      id: '00000000-0000-0000-0000-000000000001',
      canva_access_token: token.access_token,
      canva_token_expiry: expiry,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    return Response.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}?canva_connected=1`, 302);
  } catch (err) {
    console.error('Canva callback error:', err);
    return Response.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}?canva_error=${encodeURIComponent(err.message)}`, 302);
  }
}
