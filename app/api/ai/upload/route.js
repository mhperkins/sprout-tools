/**
 * API Route: /api/upload
 * Accepts image or video multipart upload.
 * Routes to Supabase Storage: post-images/{userId}/{timestamp}_{filename}
 * Returns public URL.
 * Optionally writes image_url to social_posts if postId is provided.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // service role — bypasses RLS for storage writes
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');
    const postId = formData.get('postId') || null;   // optional

    if (!file || !userId) {
      return Response.json({ error: 'file and userId are required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/quicktime', 'video/webm',
    ];
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }

    // Validate file size: images 50MB, videos 1GB
    const isVideo = file.type.startsWith('video/');
    const maxBytes = isVideo ? 1_000_000_000 : 50_000_000;
    if (file.size > maxBytes) {
      return Response.json({ error: `File too large. Max: ${isVideo ? '1GB' : '50MB'}` }, { status: 400 });
    }

    // Build storage path
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${userId}/${timestamp}_${safeName}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabaseAdmin.storage
      .from('post-images')
      .upload(storagePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return Response.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('post-images')
      .getPublicUrl(storagePath);

    // Optionally write image_url to social_posts row
    if (postId) {
      const updateField = isVideo ? 'image_url' : 'image_url';  // use image_url for both; mediaItems handled client-side
      const { error: dbError } = await supabaseAdmin
        .from('social_posts')
        .update({ [updateField]: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', postId);

      if (dbError) {
        // Non-fatal — file uploaded, just log the DB write failure
        console.error('DB write error after upload:', dbError);
      }
    }

    return Response.json({
      success: true,
      url: publicUrl,
      storagePath,
      fileType: isVideo ? 'video' : 'image',
      fileName: safeName,
    });

  } catch (error) {
    console.error('Upload route error:', error);
    return Response.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}

// Required for file uploads — disable body parsing
export const config = {
  api: { bodyParser: false },
};