import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getToken() {
  const { data } = await supabaseAdmin
    .from('social_profile')
    .select('canva_access_token, canva_token_expiry')
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .single();
  if (!data?.canva_access_token) throw new Error('Canva not connected');
  return data.canva_access_token;
}

export async function GET() {
  try {
    const token = await getToken();
    const res = await fetch('https://api.canva.com/rest/v1/designs?limit=20', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch designs');

    const designs = (json.items || []).map(d => ({
      id: d.id,
      title: d.title || 'Untitled',
      thumbnail: d.thumbnail?.url || null,
      updated_at: d.updated_at,
    }));
    return Response.json({ designs });
  } catch (err) {
    const notConnected = err.message === 'Canva not connected';
    return Response.json({ error: err.message }, { status: notConnected ? 401 : 500 });
  }
}
