/**
 * API Route: /api/instagram
 * Proxies Instagram actions via Composio /api/v2/actions/proxy endpoint.
 * Actions: 'publish' | 'get_media' | 'check_quota'
 */

const COMPOSIO_API_KEY = process.env.COMPOSIO_API_KEY;
const IG_USER_ID = process.env.IG_USER_ID || '26250961947918548';
const CONNECTED_ACCOUNT_ID = process.env.COMPOSIO_CONNECTED_ACCOUNT_ID || 'a0a7aebd-5e2a-4dd3-b8d2-702a2ff96341';

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
  // Instagram sometimes returns an error object inside data even when Composio says successful
  if (json?.data?.error) {
    const igErr = json.data.error;
    throw new Error(`Instagram error (${igErr.code || igErr.error_subcode || '?'}): ${igErr.message || igErr.error_user_msg || JSON.stringify(igErr)}`);
  }
  return json;
}

// Poll until Instagram has finished processing the media container
async function waitForContainer(creationId, maxAttempts = 10, intervalMs = 2000) {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await composioProxy(`/${creationId}?fields=status_code`, 'GET');
    const status = result?.data?.status_code;
    if (status === 'FINISHED') return;
    if (status === 'ERROR') throw new Error('Instagram media processing failed');
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error('Instagram media container timed out after processing');
}

export async function POST(request) {
  if (!COMPOSIO_API_KEY) {
    return Response.json({ error: 'Composio API key not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { action, imageUrl, caption, mediaId, contentType, mediaItems, thumbnailUrl } = body;

    // ── Publish ──────────────────────────────────────────────────────────────
    if (action === 'publish') {

      // ── CAROUSEL ────────────────────────────────────────────────────────────
      if (contentType === 'carousel' && mediaItems?.length > 0) {
        // Step 1: Create child containers for each media item
        const childIds = [];
        for (const item of mediaItems) {
          const isVideo = item.type === 'video';
          const childBody = isVideo
            ? { video_url: item.url, media_type: 'VIDEO', is_carousel_item: true }
            : { image_url: item.url, media_type: 'IMAGE', is_carousel_item: true };
          const child = await composioProxy(`/${IG_USER_ID}/media`, 'POST', childBody);
          const childId = child?.data?.id;
          if (!childId) throw new Error(`No id returned for carousel child item`);
          childIds.push(childId);
        }

        // Step 2: Create carousel parent container
        const parent = await composioProxy(`/${IG_USER_ID}/media`, 'POST', {
          media_type: 'CAROUSEL',
          children: childIds.join(','),
          caption: caption || '',
        });
        const creationId = parent?.data?.id;
        if (!creationId) throw new Error('No creation_id returned from carousel container step');

        // Step 3: Wait for processing, then publish
        await waitForContainer(creationId);
        const published = await composioProxy(`/${IG_USER_ID}/media_publish`, 'POST', { creation_id: creationId });
        const publishedMediaId = published?.data?.id;
        if (!publishedMediaId) throw new Error('No media_id returned from carousel publish step');
        return Response.json({ success: true, media_id: publishedMediaId });
      }

      // ── REEL ─────────────────────────────────────────────────────────────────
      if (contentType === 'reel') {
        const videoUrl = mediaItems?.[0]?.url || imageUrl;
        if (!videoUrl) return Response.json({ error: 'videoUrl is required for reels' }, { status: 400 });

        const reelBody = {
          media_type: 'REELS',
          video_url: videoUrl,
          caption: caption || '',
        };
        if (thumbnailUrl) reelBody.cover_url = thumbnailUrl;

        const container = await composioProxy(`/${IG_USER_ID}/media`, 'POST', reelBody);
        const creationId = container?.data?.id;
        if (!creationId) throw new Error('No creation_id returned from reel container step');

        await waitForContainer(creationId);
        const published = await composioProxy(`/${IG_USER_ID}/media_publish`, 'POST', { creation_id: creationId });
        const publishedMediaId = published?.data?.id;
        if (!publishedMediaId) throw new Error('No media_id returned from reel publish step');
        return Response.json({ success: true, media_id: publishedMediaId });
      }

      // ── STORY ────────────────────────────────────────────────────────────────
      if (contentType === 'story') {
        const storyUrl = mediaItems?.[0]?.url || imageUrl;
        if (!storyUrl) return Response.json({ error: 'imageUrl is required for story' }, { status: 400 });

        const container = await composioProxy(`/${IG_USER_ID}/media`, 'POST', {
          media_type: 'STORIES',
          image_url: storyUrl,
        });
        const creationId = container?.data?.id;
        if (!creationId) throw new Error('No creation_id returned from story container step');

        await waitForContainer(creationId);
        const published = await composioProxy(`/${IG_USER_ID}/media_publish`, 'POST', { creation_id: creationId });
        const publishedMediaId = published?.data?.id;
        if (!publishedMediaId) throw new Error('No media_id returned from story publish step');
        return Response.json({ success: true, media_id: publishedMediaId });
      }

      // ── IMAGE (default: post) ────────────────────────────────────────────────
      const finalImageUrl = mediaItems?.[0]?.url || imageUrl;
      if (!finalImageUrl) return Response.json({ error: 'imageUrl is required' }, { status: 400 });

      const container = await composioProxy(`/${IG_USER_ID}/media`, 'POST', {
        image_url: finalImageUrl,
        caption: caption || '',
        media_type: 'IMAGE',
      });
      const creationId = container?.data?.id;
      if (!creationId) throw new Error('No creation_id returned from media container step');

      await waitForContainer(creationId);
      const published = await composioProxy(`/${IG_USER_ID}/media_publish`, 'POST', { creation_id: creationId });
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
        `/${IG_USER_ID}/content_publishing_limit?fields=config,quota_usage`,
        'GET'
      );
      return Response.json(result?.data || {});
    }

    // ── List user's media (for import) ───────────────────────────────────────
    if (action === 'getMedia') {
      const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;

      // Prefer a direct IG token if configured — bypasses Composio scope limits.
      // Composio connections typically only have instagram_content_publish scope
      // and cannot read media. Add IG_ACCESS_TOKEN to .env.local to enable import.
      if (IG_ACCESS_TOKEN) {
        const fields = 'id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count';
        const url = `https://graph.facebook.com/v19.0/${IG_USER_ID}/media?fields=${fields}&limit=25&access_token=${IG_ACCESS_TOKEN}`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.error) {
          return Response.json({ success: false, error: `Instagram: ${json.error.message} (code ${json.error.code})` });
        }
        return Response.json({ success: true, media: json.data || [] });
      }

      // Fallback: try through Composio (requires instagram_basic scope on the connection)
      const result = await composioProxy(
        `/${IG_USER_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count&limit=25`,
        'GET'
      );
      const raw = result?.data;
      if (raw?.error) {
        return Response.json({
          success: false,
          error: `Instagram (via Composio) error (${raw.error.code || '?'}): ${raw.error.message || raw.error.type || 'unknown'}. Your Composio connection may be missing instagram_basic scope.`,
        });
      }
      const media = Array.isArray(raw) ? raw
        : Array.isArray(raw?.data) ? raw.data
        : Array.isArray(result?.media) ? result.media
        : Array.isArray(result) ? result
        : [];
      return Response.json({ success: true, media, _debug: media.length === 0 ? result : undefined });
    }

    return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });

  } catch (error) {
    console.error('Instagram API error:', error);
    return Response.json({ error: error.message || 'Instagram request failed' }, { status: 500 });
  }
}