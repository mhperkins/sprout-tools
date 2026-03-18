/**
 * API Route: /api/instagram
 * Proxies Instagram publishing actions via Composio REST API.
 * Actions: 'publish' | 'get_media' | 'check_quota'
 */

const COMPOSIO_API_KEY = process.env.COMPOSIO_API_KEY;
const IG_USER_ID = '26209113175417350';
const CONNECTED_ACCOUNT_ID = 'ca_mHMSruIA_Y1o';

async function composioExecute(toolSlug, input) {
  const res = await fetch(
    `https://backend.composio.dev/api/v2/actions/${toolSlug}/execute`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': COMPOSIO_API_KEY,
      },
      body: JSON.stringify({
        connectedAccountId: CONNECTED_ACCOUNT_ID,
        input,
      }),
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || `Composio error: ${res.status}`);
  return json;
}

export async function POST(request) {
  if (!COMPOSIO_API_KEY) {
    return Response.json({ error: 'Composio API key not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { action, imageUrl, caption, mediaId } = body;

    // ── Publish ──────────────────────────────────────────────────────────────
    if (action === 'publish') {
      if (!imageUrl) {
        return Response.json({ error: 'imageUrl is required' }, { status: 400 });
      }

      // Step 1: Create media container
      const container = await composioExecute('INSTAGRAM_POST_IG_USER_MEDIA', {
        ig_user_id: IG_USER_ID,
        image_url: imageUrl,
        caption: caption || '',
      });
      const creationId = container?.data?.id;
      if (!creationId) throw new Error('No creation_id returned from media container step');

      // Step 2: Publish container (auto-polls for FINISHED status)
      const published = await composioExecute('INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH', {
        ig_user_id: IG_USER_ID,
        creation_id: creationId,
        max_wait_seconds: 90,
      });
      const publishedMediaId = published?.data?.id;
      if (!publishedMediaId) throw new Error('No media_id returned from publish step');

      return Response.json({ success: true, media_id: publishedMediaId });
    }

    // ── Get published media details ───────────────────────────────────────────
    if (action === 'get_media') {
      if (!mediaId) return Response.json({ error: 'mediaId required' }, { status: 400 });
      const result = await composioExecute('INSTAGRAM_GET_IG_MEDIA', {
        ig_media_id: mediaId,
        fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
      });
      return Response.json(result?.data || {});
    }

    // ── Check daily publish quota ─────────────────────────────────────────────
    if (action === 'check_quota') {
      const result = await composioExecute('INSTAGRAM_GET_IG_USER_CONTENT_PUBLISHING_LIMIT', {
        ig_user_id: IG_USER_ID,
        fields: 'quota_usage,config',
      });
      return Response.json(result?.data || {});
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('Instagram route error:', error);
    return Response.json({ error: error.message || 'Instagram request failed' }, { status: 500 });
  }
}
