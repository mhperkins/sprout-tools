import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');

    if (!file || !userId) {
      return Response.json({ error: 'Missing file or userId' }, { status: 400 });
    }

    const ext = file.name.split('.').pop();
    const filename = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabase.storage
      .from('post-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) return Response.json({ error: error.message }, { status: 500 });

    const { data: { publicUrl } } = supabase.storage
      .from('post-images')
      .getPublicUrl(filename);

    return Response.json({ url: publicUrl, path: filename });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}