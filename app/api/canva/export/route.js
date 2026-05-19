import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getToken() {
  const { data } = await supabaseAdmin
    .from('social_profile')
    .select('canva_access_token')
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .single();
  if (!data?.canva_access_token) throw new Error('Canva not connected');
  return data.canva_access_token;
}

export async function POST(request) {
  try {
    const { designId } = await request.json();
    if (!designId) return Response.json({ error: 'designId required' }, { status: 400 });

    const token = await getToken();

    // Create export job
    const exportRes = await fetch('https://api.canva.com/rest/v1/exports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ design_id: designId, format: { type: 'png', lossless: false } }),
    });
    const exportJob = await exportRes.json();
    if (!exportRes.ok) throw new Error(exportJob.message || 'Export creation failed');

    const jobId = exportJob.job?.id;
    if (!jobId) throw new Error('No export job ID returned');

    // Poll until done (max 15 attempts × 2s = 30s)
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const pollRes = await fetch(`https://api.canva.com/rest/v1/exports/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const poll = await pollRes.json();
      const status = poll.job?.status;
      if (status === 'success') {
        const url = poll.job?.urls?.[0];
        if (!url) throw new Error('Export succeeded but no URL returned');
        return Response.json({ url });
      }
      if (status === 'failed') throw new Error('Canva export failed');
    }
    throw new Error('Canva export timed out');
  } catch (err) {
    console.error('Canva export error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
