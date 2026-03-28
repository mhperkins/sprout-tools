/**
 * API Route: /api/instagram
 * Proxies Instagram actions via Composio /api/v2/actions/proxy endpoint.
 * Actions: 'publish' | 'get_media' | 'check_quota'
 */

const COMPOSIO_API_KEY = process.env.COMPOSIO_API_KEY;
const IG_USER_ID = process.env.IG_USER_ID || '26250961947918548';           // test: @test_sprout_2026
const CONNECTED_ACCOUNT_ID = process.env.COMPOSIO_CONNECTED_ACCOUNT_ID || 'a0a7aebd-5e2a-4dd3-b8d2-702a2ff96341'; // test account

async function composioProxy(endpoint, method = 'POST', body = null) {
  const payload = {
    connectedAccountId: CONNECTED_ACCOUNT_ID,
    endpoint,
    method,
    ...(body && { body }),
  };

  const res = await fetch('https://backend.composio.dev/api/v2/actions/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': COMPOSIO_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || json?.successful === false) {
    throw new Error(json?.error || json?.message || `Composio proxy error: ${res.status}`);
  }
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
      const container = await composioProxy(`/${IG_USER_ID}/media`, 'POST', {
        image_url: imageUrl,
        caption: caption || '',
        media_type: 'IMAGE',
      });
      const creationId = container?.data?.id;
      if (!creationId) throw new Error('No creation_id returned from media container step');

      // Step 2: Publish container
      const published = await composioProxy(`/${IG_USER_ID}/media_publish`, 'POST', {
        creation_id: creationId,
      });
      const publishedMediaId = published?.data?.id;
      if (!publishedMediaId) throw new Error('No media_id returned from publish step');

      return Response.json({ success: true, media_id: publishedMediaId });
    }

    // ── Get published media details ───────────────────────────────────────────
    if (action === 'get_media') {
      if (!mediaId) return Response.json({ error: 'mediaId required' }, { status: 400 });
      const result = await composioProxy(
        `/${mediaId}?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count`,
        'GET'
      );
      return Response.json(result?.data || {});
    }

    // ── Check daily publish quota ─────────────────────────────────────────────
    if (action === 'check_quota') {
      const result = await composioProxy(
        `/${IG_USER_ID}/content_publishing_limit?fields=quota_usage,config`,
        'GET'
      );
      return Response.json(result?.data || {});
    }
    
// ── Refresh metrics for multiple posts ───────────────────────────────────
    if (action === 'refresh_metrics') {
      const { posts } = body;
      if (!posts?.length) return Response.json({ error: 'posts array required' }, { status: 400 });

      const results = await Promise.all(
        posts.map(async ({ postId, mediaId }) => {
          try {
            const result = await composioProxy(
              `/${mediaId}?fields=like_count,comments_count,permalink,timestamp`,
              'GET'
            );
            return {
              postId,
              success: true,
              likes: result?.data?.like_count || 0,
              comments: result?.data?.comments_count || 0,
            };
          } catch (e) {
            return { postId, success: false, error: e.message };
          }
        })
      );
      return Response.json({ success: true, results });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('Instagram route error:', error);
    return Response.json({ error: error.message || 'Instagram request failed' }, { status: 500 });
  }
}