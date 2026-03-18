/**
 * API Route: /api/ai
 * Proxies requests to the Anthropic API so the key stays server-side.
 */
export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();

    // Validate: only allow messages endpoint parameters
    const allowed = ['model', 'max_tokens', 'messages', 'system', 'tools', 'mcp_servers'];
    const cleaned = {};
    for (const key of allowed) {
      if (body[key] !== undefined) cleaned[key] = body[key];
    }

    // Force model to prevent abuse
    cleaned.model = cleaned.model || 'claude-sonnet-4-20250514';
    cleaned.max_tokens = Math.min(cleaned.max_tokens || 1000, 4096);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(cleaned),
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('AI proxy error:', error);
    return Response.json({ error: 'AI request failed' }, { status: 500 });
  }
}
